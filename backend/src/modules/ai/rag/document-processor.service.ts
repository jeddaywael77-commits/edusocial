import { Injectable, Logger } from '@nestjs/common';

export interface ProcessedDocument {
  title: string;
  content: string;
  sections: { heading: string; content: string; level: number }[];
  tables: { headers: string[]; rows: string[][] }[];
  codeBlocks: { language: string; code: string }[];
  metadata: {
    pageCount?: number;
    wordCount: number;
    charCount: number;
    language?: string;
    author?: string;
    createdAt?: Date;
    fileType: string;
    mimeType: string;
  };
}

@Injectable()
export class DocumentProcessor {
  private readonly logger = new Logger(DocumentProcessor.name);

  async processBuffer(buffer: Buffer, mimeType: string, filename: string): Promise<ProcessedDocument> {
    switch (mimeType) {
      case 'application/pdf':
        return this.processPDF(buffer, filename);
      case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
        return this.processDOCX(buffer, filename);
      case 'text/plain':
        return this.processTXT(buffer, filename);
      case 'text/markdown':
        return this.processMarkdown(buffer, filename);
      case 'text/html':
        return this.processHTML(buffer, filename);
      default:
        return this.processTXT(buffer, filename);
    }
  }

  private async processPDF(buffer: Buffer, filename: string): Promise<ProcessedDocument> {
    try {
      const pdfParse = require('pdf-parse');
      const data = await pdfParse(buffer);

      const sections = this.extractSections(data.text);
      const tables = this.extractTables(data.text);
      const codeBlocks = this.extractCodeBlocks(data.text);

      return {
        title: filename.replace(/\.pdf$/i, ''),
        content: data.text,
        sections,
        tables,
        codeBlocks,
        metadata: {
          pageCount: data.numpages,
          wordCount: data.text.split(/\s+/).length,
          charCount: data.text.length,
          fileType: 'pdf',
          mimeType: 'application/pdf',
        },
      };
    } catch (error) {
      this.logger.error(`PDF processing failed: ${error.message}`);
      return this.createFallbackDocument(buffer.toString(), filename, 'pdf');
    }
  }

  private async processDOCX(buffer: Buffer, filename: string): Promise<ProcessedDocument> {
    try {
      const mammoth = require('mammoth');
      const result = await mammoth.extractRawText({ buffer });
      const text = result.value;

      const sections = this.extractSections(text);
      const tables = this.extractTables(text);
      const codeBlocks = this.extractCodeBlocks(text);

      return {
        title: filename.replace(/\.docx?$/i, ''),
        content: text,
        sections,
        tables,
        codeBlocks,
        metadata: {
          wordCount: text.split(/\s+/).length,
          charCount: text.length,
          fileType: 'docx',
          mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        },
      };
    } catch (error) {
      this.logger.error(`DOCX processing failed: ${error.message}`);
      return this.createFallbackDocument(buffer.toString(), filename, 'docx');
    }
  }

  private processTXT(buffer: Buffer, filename: string): ProcessedDocument {
    const text = buffer.toString('utf-8');
    const sections = this.extractSections(text);
    const codeBlocks = this.extractCodeBlocks(text);

    return {
      title: filename.replace(/\.\w+$/, ''),
      content: text,
      sections,
      tables: [],
      codeBlocks,
      metadata: {
        wordCount: text.split(/\s+/).length,
        charCount: text.length,
        fileType: 'txt',
        mimeType: 'text/plain',
      },
    };
  }

  private processMarkdown(buffer: Buffer, filename: string): ProcessedDocument {
    const text = buffer.toString('utf-8');
    const sections = this.extractMarkdownSections(text);
    const codeBlocks = this.extractCodeBlocks(text);
    const tables = this.extractMarkdownTables(text);

    return {
      title: filename.replace(/\.md$/i, ''),
      content: text,
      sections,
      tables,
      codeBlocks,
      metadata: {
        wordCount: text.split(/\s+/).length,
        charCount: text.length,
        fileType: 'md',
        mimeType: 'text/markdown',
      },
    };
  }

  private processHTML(buffer: Buffer, filename: string): ProcessedDocument {
    const text = buffer.toString('utf-8');
    // Strip HTML tags for basic extraction
    const cleaned = text.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
    const sections = this.extractSections(cleaned);

    return {
      title: filename.replace(/\.html?$/i, ''),
      content: cleaned,
      sections,
      tables: [],
      codeBlocks: [],
      metadata: {
        wordCount: cleaned.split(/\s+/).length,
        charCount: cleaned.length,
        fileType: 'html',
        mimeType: 'text/html',
      },
    };
  }

  private extractSections(text: string): { heading: string; content: string; level: number }[] {
    const sections: { heading: string; content: string; level: number }[] = [];
    const lines = text.split('\n');
    let currentHeading = '';
    let currentContent = '';
    let currentLevel = 0;

    for (const line of lines) {
      const headingMatch = line.match(/^(#{1,6})\s+(.+)/);
      if (headingMatch) {
        if (currentHeading) {
          sections.push({ heading: currentHeading, content: currentContent.trim(), level: currentLevel });
        }
        currentLevel = headingMatch[1].length;
        currentHeading = headingMatch[2];
        currentContent = '';
      } else {
        currentContent += line + '\n';
      }
    }

    if (currentHeading) {
      sections.push({ heading: currentHeading, content: currentContent.trim(), level: currentLevel });
    }

    // If no sections found, create a single section
    if (sections.length === 0 && text.trim()) {
      sections.push({ heading: 'Content', content: text.trim(), level: 1 });
    }

    return sections;
  }

  private extractMarkdownSections(text: string): { heading: string; content: string; level: number }[] {
    return this.extractSections(text);
  }

  private extractTables(text: string): { headers: string[]; rows: string[][] }[] {
    const tables: { headers: string[]; rows: string[][] }[] = [];
    const lines = text.split('\n');
    let inTable = false;
    let headers: string[] = [];
    let rows: string[][] = [];

    for (const line of lines) {
      const cells = line.split('|').map((c) => c.trim()).filter(Boolean);
      if (cells.length > 1 && cells.some((c) => c !== '-')) {
        if (!inTable) {
          inTable = true;
          headers = cells;
          rows = [];
        } else {
          rows.push(cells);
        }
      } else if (inTable) {
        tables.push({ headers, rows });
        inTable = false;
        headers = [];
        rows = [];
      }
    }

    if (inTable) tables.push({ headers, rows });
    return tables;
  }

  private extractMarkdownTables(text: string): { headers: string[]; rows: string[][] }[] {
    return this.extractTables(text);
  }

  private extractCodeBlocks(text: string): { language: string; code: string }[] {
    const blocks: { language: string; code: string }[] = [];
    const regex = /```(\w*)\n([\s\S]*?)```/g;
    let match;

    while ((match = regex.exec(text)) !== null) {
      blocks.push({
        language: match[1] || 'text',
        code: match[2].trim(),
      });
    }

    return blocks;
  }

  private createFallbackDocument(content: string, filename: string, fileType: string): ProcessedDocument {
    return {
      title: filename.replace(/\.\w+$/, ''),
      content,
      sections: [{ heading: 'Content', content, level: 1 }],
      tables: [],
      codeBlocks: [],
      metadata: {
        wordCount: content.split(/\s+/).length,
        charCount: content.length,
        fileType,
        mimeType: 'text/plain',
      },
    };
  }
}
