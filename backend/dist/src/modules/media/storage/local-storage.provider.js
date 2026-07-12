"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var LocalStorageProvider_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.LocalStorageProvider = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const fs = __importStar(require("fs/promises"));
const path = __importStar(require("path"));
let LocalStorageProvider = LocalStorageProvider_1 = class LocalStorageProvider {
    configService;
    logger = new common_1.Logger(LocalStorageProvider_1.name);
    uploadDir;
    baseUrl;
    constructor(configService) {
        this.configService = configService;
        this.uploadDir =
            this.configService.get('app.uploadDir') || './uploads';
        this.baseUrl =
            this.configService.get('app.storageBaseUrl') ||
                `http://localhost:${this.configService.get('app.port') || 3001}/uploads`;
    }
    async ensureDir(dirPath) {
        await fs.mkdir(dirPath, { recursive: true });
    }
    async upload(buffer, options) {
        const filePath = path.join(this.uploadDir, options.key);
        const dir = path.dirname(filePath);
        await this.ensureDir(dir);
        await fs.writeFile(filePath, buffer);
        return {
            key: options.key,
            bucket: options.bucket,
            url: `${this.baseUrl}/${options.key}`,
            size: buffer.length,
        };
    }
    async uploadStream(stream, options) {
        const filePath = path.join(this.uploadDir, options.key);
        const dir = path.dirname(filePath);
        await this.ensureDir(dir);
        const chunks = [];
        for await (const chunk of stream) {
            chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
        }
        const buffer = Buffer.concat(chunks);
        await fs.writeFile(filePath, buffer);
        return {
            key: options.key,
            bucket: options.bucket,
            url: `${this.baseUrl}/${options.key}`,
            size: buffer.length,
        };
    }
    async delete(bucket, key) {
        const filePath = path.join(this.uploadDir, key);
        try {
            await fs.unlink(filePath);
        }
        catch (err) {
            if (err.code !== 'ENOENT') {
                this.logger.error(`Failed to delete file: ${filePath}`, err.message);
            }
        }
    }
    async getSignedUrl(options) {
        return `${this.baseUrl}/${options.key}`;
    }
    getPublicUrl(bucket, key) {
        return `${this.baseUrl}/${key}`;
    }
    async copy(srcBucket, srcKey, destBucket, destKey) {
        const srcPath = path.join(this.uploadDir, srcKey);
        const destPath = path.join(this.uploadDir, destKey);
        await this.ensureDir(path.dirname(destPath));
        await fs.copyFile(srcPath, destPath);
    }
};
exports.LocalStorageProvider = LocalStorageProvider;
exports.LocalStorageProvider = LocalStorageProvider = LocalStorageProvider_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], LocalStorageProvider);
//# sourceMappingURL=local-storage.provider.js.map