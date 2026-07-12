"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MediaModule = void 0;
const common_1 = require("@nestjs/common");
const bullmq_1 = require("@nestjs/bullmq");
const platform_express_1 = require("@nestjs/platform-express");
const media_controller_1 = require("./media.controller");
const media_service_1 = require("./media.service");
const processors_1 = require("./processors");
const storage_1 = require("./storage");
const auth_module_1 = require("../auth/auth.module");
const config_1 = require("@nestjs/config");
const multer_1 = require("multer");
const path_1 = require("path");
const uuid_1 = require("uuid");
let MediaModule = class MediaModule {
};
exports.MediaModule = MediaModule;
exports.MediaModule = MediaModule = __decorate([
    (0, common_1.Module)({
        imports: [
            auth_module_1.AuthModule,
            config_1.ConfigModule,
            platform_express_1.MulterModule.registerAsync({
                imports: [config_1.ConfigModule],
                useFactory: (configService) => ({
                    storage: (0, multer_1.diskStorage)({
                        destination: configService.get('app.uploadDir') || './uploads',
                        filename: (_req, file, cb) => {
                            const uniqueName = `${(0, uuid_1.v4)()}${(0, path_1.extname)(file.originalname)}`;
                            cb(null, uniqueName);
                        },
                    }),
                    limits: {
                        fileSize: configService.get('media.maxFileSize') || 50 * 1024 * 1024,
                    },
                }),
                inject: [config_1.ConfigService],
            }),
            bullmq_1.BullModule.registerQueue({
                name: 'media-processing',
                defaultJobOptions: {
                    removeOnComplete: 100,
                    removeOnFail: 50,
                    attempts: 3,
                    backoff: {
                        type: 'exponential',
                        delay: 2000,
                    },
                },
            }),
        ],
        controllers: [media_controller_1.MediaController],
        providers: [
            media_service_1.MediaService,
            processors_1.MediaProcessor,
            processors_1.ImageProcessor,
            processors_1.DocumentProcessor,
            storage_1.LocalStorageProvider,
            storage_1.MinioStorageProvider,
            storage_1.S3StorageProvider,
            storage_1.StorageFactory,
        ],
        exports: [media_service_1.MediaService, storage_1.StorageFactory],
    })
], MediaModule);
//# sourceMappingURL=media.module.js.map