import { registerAs } from '@nestjs/config';

export default registerAs('ai', () => ({
  // Provider selection
  provider: process.env.AI_PROVIDER || 'openai',

  // OpenAI
  openaiApiKey: process.env.OPENAI_API_KEY || '',
  openaiBaseUrl: process.env.OPENAI_BASE_URL || 'https://api.openai.com/v1',
  openaiModel: process.env.OPENAI_MODEL || 'gpt-4o-mini',

  // Groq
  groqApiKey: process.env.GROQ_API_KEY || '',
  groqBaseUrl: process.env.GROQ_BASE_URL || 'https://api.groq.com/openai/v1',
  groqModel: process.env.GROQ_MODEL || 'llama-3.3-70b-versatile',

  // Ollama
  ollamaBaseUrl: process.env.OLLAMA_BASE_URL || 'http://localhost:11434',
  ollamaModel: process.env.OLLAMA_MODEL || 'llama3.1',

  // Gemini
  geminiApiKey: process.env.GEMINI_API_KEY || '',
  geminiModel: process.env.GEMINI_MODEL || 'gemini-2.0-flash',

  // Embeddings
  embeddingProvider: process.env.AI_EMBEDDING_PROVIDER || 'openai',
  embeddingModel: process.env.AI_EMBEDDING_MODEL || 'text-embedding-3-small',
  embeddingDimensions: parseInt(
    process.env.AI_EMBEDDING_DIMENSIONS || '1536',
    10,
  ),

  // Qdrant
  qdrantUrl: process.env.QDRANT_URL || 'http://localhost:6333',
  qdrantApiKey: process.env.QDRANT_API_KEY || '',
  qdrantCollectionPrefix: process.env.QDRANT_COLLECTION_PREFIX || 'edusocial_',

  // RAG
  ragChunkSize: parseInt(process.env.AI_RAG_CHUNK_SIZE || '1000', 10),
  ragChunkOverlap: parseInt(process.env.AI_RAG_CHUNK_OVERLAP || '200', 10),
  ragMaxContextLength: parseInt(
    process.env.AI_RAG_MAX_CONTEXT_LENGTH || '8000',
    10,
  ),
  ragTopK: parseInt(process.env.AI_RAG_TOP_K || '10', 10),
  ragRerankTopK: parseInt(process.env.AI_RAG_RERANK_TOP_K || '5', 10),

  // Chat
  chatMaxHistory: parseInt(process.env.AI_CHAT_MAX_HISTORY || '50', 10),
  chatMaxTokens: parseInt(process.env.AI_CHAT_MAX_TOKENS || '4096', 10),
  chatTemperature: parseFloat(process.env.AI_CHAT_TEMPERATURE || '0.7'),
  chatStreamEnabled: process.env.AI_CHAT_STREAM_ENABLED !== 'false',

  // Rate limiting
  rateLimitRequests: parseInt(process.env.AI_RATE_LIMIT_REQUESTS || '30', 10),
  rateLimitTokensPerMinute: parseInt(
    process.env.AI_RATE_LIMIT_TPM || '100000',
    10,
  ),

  // Cost tracking (per 1M tokens)
  costInputPer1M: parseFloat(process.env.AI_COST_INPUT_PER_1M || '0.15'),
  costOutputPer1M: parseFloat(process.env.AI_COST_OUTPUT_PER_1M || '0.60'),

  // Security
  contentModerationEnabled: process.env.AI_CONTENT_MODERATION === 'true',
  piiFilterEnabled: process.env.AI_PII_FILTER === 'true',
  injectionProtectionEnabled: process.env.AI_INJECTION_PROTECTION !== 'false',
}));
