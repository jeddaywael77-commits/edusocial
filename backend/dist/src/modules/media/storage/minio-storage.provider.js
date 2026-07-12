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
var MinioStorageProvider_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.MinioStorageProvider = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const Minio = __importStar(require("minio"));
let MinioStorageProvider = MinioStorageProvider_1 = class MinioStorageProvider {
    configService;
    logger = new common_1.Logger(MinioStorageProvider_1.name);
    client;
    constructor(configService) {
        this.configService = configService;
    }
    async onModuleInit() {
        this.client = new Minio.Client({
            endPoint: this.configService.get('media.minioEndpoint') || 'localhost',
            port: this.configService.get('media.minioPort') || 9000,
            useSSL: this.configService.get('media.minioUseSsl') || false,
            accessKey: this.configService.get('media.minioAccessKey') || 'minioadmin',
            secretKey: this.configService.get('media.minioSecretKey') || 'minioadmin',
        });
        const bucket = this.configService.get('media.minioBucket') || 'edusocial';
        const exists = await this.client.bucketExists(bucket);
        if (!exists) {
            await this.client.makeBucket(bucket, this.configService.get('media.minioRegion') || 'us-east-1');
            const policy = JSON.stringify({
                Version: '2012-10-17',
                Statement: [
                    {
                        Effect: 'Allow',
                        Principal: { AWS: ['*'] },
                        Action: ['s3:GetObject'],
                        Resource: [`arn:aws:s3:::${bucket}/public/*`],
                    },
                ],
            });
            await this.client.setBucketPolicy(bucket, policy);
            this.logger.log(`Bucket "${bucket}" created with public read policy`);
        }
        this.logger.log('MinIO client initialized');
    }
    onModuleDestroy() {
    }
    async upload(buffer, options) {
        const result = await this.client.putObject(options.bucket, options.key, buffer, buffer.length, { 'Content-Type': options.contentType, ...options.metadata });
        const url = await this.getSignedUrl({
            bucket: options.bucket,
            key: options.key,
        });
        return {
            key: options.key,
            bucket: options.bucket,
            url,
            size: buffer.length,
            etag: result.etag,
        };
    }
    async uploadStream(stream, options) {
        const chunks = [];
        for await (const chunk of stream) {
            chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
        }
        const buffer = Buffer.concat(chunks);
        return this.upload(buffer, options);
    }
    async delete(bucket, key) {
        await this.client.removeObject(bucket, key);
    }
    async getSignedUrl(options) {
        const expiresIn = options.expiresIn || 3600;
        return this.client.presignedGetObject(options.bucket, options.key, expiresIn);
    }
    getPublicUrl(bucket, key) {
        const endpoint = this.configService.get('media.minioEndpoint') || 'localhost';
        const port = this.configService.get('media.minioPort') || 9000;
        const useSsl = this.configService.get('media.minioUseSsl') || false;
        const protocol = useSsl ? 'https' : 'http';
        return `${protocol}://${endpoint}:${port}/${bucket}/${key}`;
    }
    async copy(srcBucket, srcKey, destBucket, destKey) {
        await this.client.copyObject(destBucket, destKey, `${srcBucket}/${srcKey}`);
    }
};
exports.MinioStorageProvider = MinioStorageProvider;
exports.MinioStorageProvider = MinioStorageProvider = MinioStorageProvider_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], MinioStorageProvider);
//# sourceMappingURL=minio-storage.provider.js.map