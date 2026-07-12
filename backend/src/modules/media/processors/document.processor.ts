import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../../database/prisma.service';

@Injectable()
export class DocumentProcessor {
  private readonly logger = new Logger(DocumentProcessor.name);

  constructor(private prisma: PrismaService) {}

  async processPdf(mediaId: string) {
    const media = await this.prisma.media.findUnique({ where: { id: mediaId } });
    if (!media) throw new Error(`Media not found: ${mediaId}`);

    try {
      const response = await fetch(media.url);
      if (!response.ok) throw new Error(`Failed to fetch PDF: ${response.status}`);
      const arrayBuffer = await response.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      let pageCount: number | undefined;
      let metadata: Record<string, any> = {};

      try {
        // eslint-disable-next-line @typescript-eslint/no-require-imports
        const pdfParse = require('pdf-parse');
        const pdfData = await pdfParse(buffer);
        pageCount = pdfData.numpages;
        metadata = {
          title: pdfData.info?.Title,
          author: pdfData.info?.Author,
          subject: pdfData.info?.Subject,
          creator: pdfData.info?.Creator,
          producer: pdfData.info?.Producer,
          creationDate: pdfData.info?.CreationDate,
          modDate: pdfData.info?.ModDate,
          keywords: pdfData.info?.Keywords,
          pdfVersion: pdfData.info?.PDFFormatVersion,
        };
      } catch (pdfError: any) {
        this.logger.warn(`PDF parse failed for ${mediaId}: ${pdfError.message}`);
      }

      await this.prisma.media.update({
        where: { id: mediaId },
        data: {
          pageCount,
          metadata: {
            ...metadata,
            processedAt: new Date().toISOString(),
          },
        },
      });

      this.logger.log(`Document processed: ${mediaId} (${pageCount} pages)`);
    } catch (error) {
      this.logger.error(`Document processing failed for ${mediaId}:`, error.message);
      throw error;
    }
  }

  async processWord(mediaId: string) {
    const media = await this.prisma.media.findUnique({ where: { id: mediaId } });
    if (!media) throw new Error(`Media not found: ${mediaId}`);

    await this.prisma.media.update({
      where: { id: mediaId },
      data: {
        metadata: {
          processedAt: new Date().toISOString(),
          format: media.extension,
        },
      },
    });

    this.logger.log(`Word document processed: ${mediaId}`);
  }

  async processExcel(mediaId: string) {
    const media = await this.prisma.media.findUnique({ where: { id: mediaId } });
    if (!media) throw new Error(`Media not found: ${mediaId}`);

    await this.prisma.media.update({
      where: { id: mediaId },
      data: {
        metadata: {
          processedAt: new Date().toISOString(),
          format: media.extension,
        },
      },
    });

    this.logger.log(`Excel document processed: ${mediaId}`);
  }

  async processPowerpoint(mediaId: string) {
    const media = await this.prisma.media.findUnique({ where: { id: mediaId } });
    if (!media) throw new Error(`Media not found: ${mediaId}`);

    await this.prisma.media.update({
      where: { id: mediaId },
      data: {
        metadata: {
          processedAt: new Date().toISOString(),
          format: media.extension,
        },
      },
    });

    this.logger.log(`PowerPoint document processed: ${mediaId}`);
  }

  async scanForVirus(mediaId: string): Promise<{ clean: boolean; details?: string }> {
    this.logger.log(`Virus scan hook called for ${mediaId} (not implemented)`);
    return { clean: true, details: 'Virus scanning not configured' };
  }

  async prepareOcr(mediaId: string): Promise<void> {
    this.logger.log(`OCR preparation hook called for ${mediaId} (not implemented)`);
  }
}
