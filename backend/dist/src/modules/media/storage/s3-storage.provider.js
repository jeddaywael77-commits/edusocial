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
var S3StorageProvider_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.S3StorageProvider = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const client_s3_1 = require("@aws-sdk/client-s3");
const s3_request_presigner_1 = require("@aws-sdk/s3-request-presigner");
let S3StorageProvider = S3StorageProvider_1 = class S3StorageProvider {
    configService;
    logger = new common_1.Logger(S3StorageProvider_1.name);
    client;
    constructor(configService) {
        this.configService = configService;
    }
    onModuleInit() {
        this.client = new client_s3_1.S3Client({
            region: this.configService.get('media.s3Region') || 'us-east-1',
            credentials: {
                accessKeyId: this.configService.get('media.s3AccessKeyId') || '',
                secretAccessKey: this.configService.get('media.s3SecretAccessKey') || '',
            },
            ...(this.configService.get('media.s3Endpoint') && {
                endpoint: this.configService.get('media.s3Endpoint'),
                forcePathStyle: true,
            }),
        });
        this.logger.log('S3 client initialized');
    }
    async upload(buffer, options) {
        const command = new client_s3_1.PutObjectCommand({
            Bucket: options.bucket,
            Key: options.key,
            Body: buffer,
            ContentType: options.contentType,
            Metadata: options.metadata,
        });
        const result = await this.client.send(command);
        return {
            key: options.key,
            bucket: options.bucket,
            url: this.getPublicUrl(options.bucket, options.key),
            size: buffer.length,
            etag: result.ETag,
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
        await this.client.send(new client_s3_1.DeleteObjectCommand({ Bucket: bucket, Key: key }));
    }
    async getSignedUrl(options) {
        const command = new client_s3_1.PutObjectCommand({
            Bucket: options.bucket,
            Key: options.key,
        });
        return (0, s3_request_presigner_1.getSignedUrl)(this.client, command, {
            expiresIn: options.expiresIn || 3600,
        });
    }
    getPublicUrl(bucket, key) {
        const endpoint = this.configService.get('media.s3Endpoint');
        if (endpoint) {
            return `${endpoint}/${bucket}/${key}`;
        }
        return `https://${bucket}.s3.amazonaws.com/${key}`;
    }
    async copy(srcBucket, srcKey, destBucket, destKey) {
        await this.client.send(new client_s3_1.CopyObjectCommand({
            Bucket: destBucket,
            Key: destKey,
            CopySource: `${srcBucket}/${srcKey}`,
        }));
    }
};
exports.S3StorageProvider = S3StorageProvider;
exports.S3StorageProvider = S3StorageProvider = S3StorageProvider_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], S3StorageProvider);
//# sourceMappingURL=s3-storage.provider.js.map