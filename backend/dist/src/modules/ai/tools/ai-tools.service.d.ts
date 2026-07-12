import { PrismaService } from '../../../database/prisma.service';
import { EmbeddingService } from '../embeddings/embedding.service';
import { ConfigService } from '@nestjs/config';
export interface AiTool {
    name: string;
    description: string;
    execute: (params: any, userId: string) => Promise<string>;
}
export declare class AiToolsService {
    private readonly prisma;
    private readonly embeddingService;
    private readonly config;
    private readonly logger;
    private tools;
    constructor(prisma: PrismaService, embeddingService: EmbeddingService, config: ConfigService);
    private registerBuiltinTools;
    getTool(name: string): AiTool | undefined;
    getToolDefinitions(): {
        name: string;
        description: string;
        parameters: any;
    }[];
    executeTool(name: string, params: any, userId: string): Promise<string>;
}
