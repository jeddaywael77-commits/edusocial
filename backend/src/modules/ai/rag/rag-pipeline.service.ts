import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ProviderFactory } from '../providers/provider.factory';
import { EmbeddingService } from '../embeddings/embedding.service';
import { VectorStoreService } from '../embeddings/vector-store.service';
import { DocumentProcessor } from './document-processor.service';
import type { ProcessedDocument } from './document-processor.service';

export interface RAGResult {
  answer: string;
  sources: {
    content: string;
    source: string;
    sourceType: string;
    score: number;
  }[];
  usage: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
  latencyMs: number;
}

@Injectable()
export class RagPipelineService {
  private readonly logger = new Logger(RagPipelineService.name);
  private readonly topK: number;
  private readonly rerankTopK: number;
  private readonly maxContextLength: number;

  constructor(
    private readonly providerFactory: ProviderFactory,
    private readonly embeddingService: EmbeddingService,
    private readonly vectorStore: VectorStoreService,
    private readonly documentProcessor: DocumentProcessor,
    private readonly config: ConfigService,
  ) {
    this.topK = this.config.get<number>('ai.ragTopK') || 10;
    this.rerankTopK = this.config.get<number>('ai.ragRerankTopK') || 5;
    this.maxContextLength =
      this.config.get<number>('ai.ragMaxContextLength') || 8000;
  }

  async indexDocument(
    buffer: Buffer,
    mimeType: string,
    filename: string,
    collection: string,
    metadata?: {
      sourceId?: string;
      sourceType?:
        | 'pdf'
        | 'docx'
        | 'txt'
        | 'md'
        | 'pptx'
        | 'image'
        | 'lesson'
        | 'assignment';
    },
  ): Promise<{ chunks: number; document: ProcessedDocument }> {
    const document = await this.documentProcessor.processBuffer(
      buffer,
      mimeType,
      filename,
    );
    const chunks = this.embeddingService.chunkDocument(document.content, {
      source: filename,
      sourceType:
        metadata?.sourceType || (mimeType.includes('pdf') ? 'pdf' : 'txt'),
      sourceId: metadata?.sourceId,
      metadata: {
        title: document.title,
        pageCount: document.metadata.pageCount,
      },
    });

    await this.embeddingService.embedAndStore(chunks, collection);
    this.logger.log(
      `Indexed ${chunks.length} chunks from "${filename}" into ${collection}`,
    );

    return { chunks: chunks.length, document };
  }

  async query(
    question: string,
    collection: string,
    options: {
      topK?: number;
      filter?: Record<string, any>;
      systemPrompt?: string;
      stream?: boolean;
    } = {},
  ): Promise<
    | RAGResult
    | AsyncGenerator<
        { content: string; done: boolean; sources?: RAGResult['sources'] },
        void,
        unknown
      >
  > {
    const startTime = Date.now();
    const topK = options.topK || this.topK;

    // Step 1: Retrieve relevant chunks
    const searchResults = await this.embeddingService.searchSimilar(
      question,
      collection,
      {
        limit: topK,
        filter: options.filter,
      },
    );

    // Step 2: Re-rank by relevance (simple score threshold)
    const reranked = searchResults
      .filter((r) => r.score > 0.5)
      .slice(0, this.rerankTopK);

    // Step 3: Assemble context
    let context = '';
    const sources: RAGResult['sources'] = [];
    for (const result of reranked) {
      const addition = `\n\n[Source: ${result.payload.source}]\n${result.payload.content}`;
      if (context.length + addition.length > this.maxContextLength) break;
      context += addition;
      sources.push({
        content: result.payload.content,
        source: result.payload.source,
        sourceType: result.payload.sourceType,
        score: result.score,
      });
    }

    // Step 4: Generate response
    const provider = this.providerFactory.getActiveProvider();
    const systemMsg =
      options.systemPrompt ||
      `You are a helpful AI assistant for EduSocial. Use the provided context to answer questions accurately. If the context doesn't contain enough information, say so. Always cite your sources.`;

    const messages = [
      { role: 'system' as const, content: systemMsg },
      {
        role: 'user' as const,
        content: `Context:\n${context}\n\nQuestion: ${question}`,
      },
    ];

    if (options.stream) {
      return this.streamResponse(provider, messages, sources, startTime);
    }

    const response = await provider.chatCompletion({
      messages,
      temperature: this.config.get<number>('ai.chatTemperature') || 0.7,
      maxTokens: this.config.get<number>('ai.chatMaxTokens') || 4096,
    });

    return {
      answer: response.content,
      sources,
      usage: response.usage,
      latencyMs: Date.now() - startTime,
    };
  }

  private async *streamResponse(
    provider: any,
    messages: any[],
    sources: RAGResult['sources'],
    startTime: number,
  ): AsyncGenerator<
    { content: string; done: boolean; sources?: RAGResult['sources'] },
    void,
    unknown
  > {
    const stream = provider.chatCompletionStream({
      messages,
      temperature: this.config.get<number>('ai.chatTemperature') || 0.7,
      maxTokens: this.config.get<number>('ai.chatMaxTokens') || 4096,
    });

    let lastChunk;
    for await (const chunk of stream) {
      if (chunk.content) {
        yield { content: chunk.content, done: false };
      }
      if (chunk.finishReason) {
        lastChunk = chunk;
      }
    }

    yield {
      content: '',
      done: true,
      sources,
    };
  }
}
