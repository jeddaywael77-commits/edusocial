"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var DocumentProcessor_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.DocumentProcessor = void 0;
const common_1 = require("@nestjs/common");
let DocumentProcessor = DocumentProcessor_1 = class DocumentProcessor {
    logger = new common_1.Logger(DocumentProcessor_1.name);
    async processBuffer(buffer, mimeType, filename) {
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
    async processPDF(buffer, filename) {
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
        }
        catch (error) {
            this.logger.error(`PDF processing failed: ${error.message}`);
            return this.createFallbackDocument(buffer.toString(), filename, 'pdf');
        }
    }
    async processDOCX(buffer, filename) {
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
        }
        catch (error) {
            this.logger.error(`DOCX processing failed: ${error.message}`);
            return this.createFallbackDocument(buffer.toString(), filename, 'docx');
        }
    }
    processTXT(buffer, filename) {
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
    processMarkdown(buffer, filename) {
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
    processHTML(buffer, filename) {
        const text = buffer.toString('utf-8');
        const cleaned = text
            .replace(/<[^>]+>/g, ' ')
            .replace(/\s+/g, ' ')
            .trim();
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
    extractSections(text) {
        const sections = [];
        const lines = text.split('\n');
        let currentHeading = '';
        let currentContent = '';
        let currentLevel = 0;
        for (const line of lines) {
            const headingMatch = line.match(/^(#{1,6})\s+(.+)/);
            if (headingMatch) {
                if (currentHeading) {
                    sections.push({
                        heading: currentHeading,
                        content: currentContent.trim(),
                        level: currentLevel,
                    });
                }
                currentLevel = headingMatch[1].length;
                currentHeading = headingMatch[2];
                currentContent = '';
            }
            else {
                currentContent += line + '\n';
            }
        }
        if (currentHeading) {
            sections.push({
                heading: currentHeading,
                content: currentContent.trim(),
                level: currentLevel,
            });
        }
        if (sections.length === 0 && text.trim()) {
            sections.push({ heading: 'Content', content: text.trim(), level: 1 });
        }
        return sections;
    }
    extractMarkdownSections(text) {
        return this.extractSections(text);
    }
    extractTables(text) {
        const tables = [];
        const lines = text.split('\n');
        let inTable = false;
        let headers = [];
        let rows = [];
        for (const line of lines) {
            const cells = line
                .split('|')
                .map((c) => c.trim())
                .filter(Boolean);
            if (cells.length > 1 && cells.some((c) => c !== '-')) {
                if (!inTable) {
                    inTable = true;
                    headers = cells;
                    rows = [];
                }
                else {
                    rows.push(cells);
                }
            }
            else if (inTable) {
                tables.push({ headers, rows });
                inTable = false;
                headers = [];
                rows = [];
            }
        }
        if (inTable)
            tables.push({ headers, rows });
        return tables;
    }
    extractMarkdownTables(text) {
        return this.extractTables(text);
    }
    extractCodeBlocks(text) {
        const blocks = [];
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
    createFallbackDocument(content, filename, fileType) {
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
};
exports.DocumentProcessor = DocumentProcessor;
exports.DocumentProcessor = DocumentProcessor = DocumentProcessor_1 = __decorate([
    (0, common_1.Injectable)()
], DocumentProcessor);
//# sourceMappingURL=document-processor.service.js.map