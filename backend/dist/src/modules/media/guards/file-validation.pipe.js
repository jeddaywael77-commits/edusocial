"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MultiFileValidationPipe = exports.FileValidationPipe = void 0;
exports.getFileCategory = getFileCategory;
exports.getAllowedMimeTypes = getAllowedMimeTypes;
const common_1 = require("@nestjs/common");
const ALLOWED_MIME_PREFIXES = {
    image: [
        'image/jpeg',
        'image/png',
        'image/gif',
        'image/webp',
        'image/svg+xml',
        'image/bmp',
        'image/tiff',
    ],
    video: [
        'video/mp4',
        'video/webm',
        'video/ogg',
        'video/quicktime',
        'video/x-msvideo',
    ],
    document: [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'application/vnd.ms-powerpoint',
        'application/vnd.openxmlformats-officedocument.presentationml.presentation',
        'text/plain',
    ],
};
const BLOCKED_MIME_TYPES = [
    'application/x-executable',
    'application/x-sharedlib',
    'application/x-msdownload',
    'application/x-bat',
    'application/x-sh',
    'application/x-script',
    'application/x-perl',
    'application/x-python',
];
let FileValidationPipe = class FileValidationPipe {
    options;
    constructor(options = {}) {
        this.options = options;
    }
    transform(file) {
        if (!file) {
            throw new common_1.BadRequestException('No file provided');
        }
        if (BLOCKED_MIME_TYPES.includes(file.mimetype)) {
            throw new common_1.BadRequestException(`File type "${file.mimetype}" is not allowed for security reasons`);
        }
        const maxSize = this.options.maxSize || 50 * 1024 * 1024;
        if (file.size > maxSize) {
            throw new common_1.BadRequestException(`File size exceeds maximum of ${Math.round(maxSize / 1024 / 1024)}MB`);
        }
        if (this.options.allowedCategories?.length) {
            const isAllowed = this.options.allowedCategories.some((cat) => {
                const prefixes = ALLOWED_MIME_PREFIXES[cat] || [];
                return prefixes.some((mime) => file.mimetype === mime ||
                    file.mimetype.startsWith(mime.split('/')[0]));
            });
            if (!isAllowed) {
                throw new common_1.BadRequestException(`File type "${file.mimetype}" is not allowed for this category`);
            }
        }
        return file;
    }
};
exports.FileValidationPipe = FileValidationPipe;
exports.FileValidationPipe = FileValidationPipe = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [Object])
], FileValidationPipe);
let MultiFileValidationPipe = class MultiFileValidationPipe {
    options;
    constructor(options = {}) {
        this.options = options;
    }
    transform(files) {
        if (!files || files.length === 0) {
            throw new common_1.BadRequestException('No files provided');
        }
        const maxFiles = this.options.maxFiles || 10;
        if (files.length > maxFiles) {
            throw new common_1.BadRequestException(`Maximum ${maxFiles} files allowed per upload`);
        }
        const maxSize = this.options.maxSize || 50 * 1024 * 1024;
        for (const file of files) {
            if (BLOCKED_MIME_TYPES.includes(file.mimetype)) {
                throw new common_1.BadRequestException(`File type "${file.mimetype}" is not allowed for security reasons`);
            }
            if (file.size > maxSize) {
                throw new common_1.BadRequestException(`File "${file.originalname}" exceeds maximum size of ${Math.round(maxSize / 1024 / 1024)}MB`);
            }
        }
        return files;
    }
};
exports.MultiFileValidationPipe = MultiFileValidationPipe;
exports.MultiFileValidationPipe = MultiFileValidationPipe = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [Object])
], MultiFileValidationPipe);
function getFileCategory(mimetype) {
    for (const [category, mimes] of Object.entries(ALLOWED_MIME_PREFIXES)) {
        if (mimes.some((m) => mimetype === m || mimetype.startsWith(m.split('/')[0]))) {
            return category;
        }
    }
    return 'other';
}
function getAllowedMimeTypes() {
    return Object.values(ALLOWED_MIME_PREFIXES).flat();
}
//# sourceMappingURL=file-validation.pipe.js.map