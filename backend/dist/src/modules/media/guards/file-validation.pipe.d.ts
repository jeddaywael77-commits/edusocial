import { PipeTransform } from '@nestjs/common';
export declare class FileValidationPipe implements PipeTransform {
    private options;
    constructor(options?: {
        maxSize?: number;
        allowedCategories?: string[];
    });
    transform(file: Express.Multer.File): Express.Multer.File;
}
export declare class MultiFileValidationPipe implements PipeTransform {
    private options;
    constructor(options?: {
        maxSize?: number;
        maxFiles?: number;
        allowedCategories?: string[];
    });
    transform(files: Express.Multer.File[]): Express.Multer.File[];
}
export declare function getFileCategory(mimetype: string): string;
export declare function getAllowedMimeTypes(): string[];
