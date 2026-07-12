export interface ProcessedDocument {
    title: string;
    content: string;
    sections: {
        heading: string;
        content: string;
        level: number;
    }[];
    tables: {
        headers: string[];
        rows: string[][];
    }[];
    codeBlocks: {
        language: string;
        code: string;
    }[];
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
export declare class DocumentProcessor {
    private readonly logger;
    processBuffer(buffer: Buffer, mimeType: string, filename: string): Promise<ProcessedDocument>;
    private processPDF;
    private processDOCX;
    private processTXT;
    private processMarkdown;
    private processHTML;
    private extractSections;
    private extractMarkdownSections;
    private extractTables;
    private extractMarkdownTables;
    private extractCodeBlocks;
    private createFallbackDocument;
}
