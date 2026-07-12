import { PrismaService } from '../../../database/prisma.service';
export declare class DocumentProcessor {
    private prisma;
    private readonly logger;
    constructor(prisma: PrismaService);
    processPdf(mediaId: string): Promise<void>;
    processWord(mediaId: string): Promise<void>;
    processExcel(mediaId: string): Promise<void>;
    processPowerpoint(mediaId: string): Promise<void>;
    scanForVirus(mediaId: string): Promise<{
        clean: boolean;
        details?: string;
    }>;
    prepareOcr(mediaId: string): Promise<void>;
}
