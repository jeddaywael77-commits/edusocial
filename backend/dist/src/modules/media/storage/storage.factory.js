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
var StorageFactory_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.StorageFactory = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const local_storage_provider_1 = require("./local-storage.provider");
const minio_storage_provider_1 = require("./minio-storage.provider");
const s3_storage_provider_1 = require("./s3-storage.provider");
let StorageFactory = StorageFactory_1 = class StorageFactory {
    configService;
    localProvider;
    minioProvider;
    s3Provider;
    logger = new common_1.Logger(StorageFactory_1.name);
    provider;
    constructor(configService, localProvider, minioProvider, s3Provider) {
        this.configService = configService;
        this.localProvider = localProvider;
        this.minioProvider = minioProvider;
        this.s3Provider = s3Provider;
        const providerType = this.configService.get('media.storageProvider') || 'local';
        this.provider = this.getProvider(providerType);
        this.logger.log(`Storage provider: ${providerType}`);
    }
    getProvider(type) {
        switch (type.toLowerCase()) {
            case 'minio':
                return this.minioProvider;
            case 's3':
            case 'aws':
                return this.s3Provider;
            case 'local':
            default:
                return this.localProvider;
        }
    }
    getProviderInstance() {
        return this.provider;
    }
};
exports.StorageFactory = StorageFactory;
exports.StorageFactory = StorageFactory = StorageFactory_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService,
        local_storage_provider_1.LocalStorageProvider,
        minio_storage_provider_1.MinioStorageProvider,
        s3_storage_provider_1.S3StorageProvider])
], StorageFactory);
//# sourceMappingURL=storage.factory.js.map