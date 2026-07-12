"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AiModule = void 0;
const common_1 = require("@nestjs/common");
const bullmq_1 = require("@nestjs/bullmq");
const ai_controller_1 = require("./ai.controller");
const provider_factory_1 = require("./providers/provider.factory");
const ai_chat_service_1 = require("./chat/ai-chat.service");
const ai_features_service_1 = require("./ai-features.service");
const ai_security_service_1 = require("./security/ai-security.service");
const ai_analytics_service_1 = require("./analytics/ai-analytics.service");
const memory_service_1 = require("./memory/memory.service");
const embedding_service_1 = require("./embeddings/embedding.service");
const vector_store_service_1 = require("./embeddings/vector-store.service");
const rag_pipeline_service_1 = require("./rag/rag-pipeline.service");
const document_processor_service_1 = require("./rag/document-processor.service");
const ai_tools_service_1 = require("./tools/ai-tools.service");
const ai_processing_processor_1 = require("./queues/ai-processing.processor");
const prisma_module_1 = require("../../database/prisma.module");
let AiModule = class AiModule {
};
exports.AiModule = AiModule;
exports.AiModule = AiModule = __decorate([
    (0, common_1.Module)({
        imports: [
            prisma_module_1.PrismaModule,
            bullmq_1.BullModule.registerQueue({
                name: 'ai-processing',
                defaultJobOptions: {
                    attempts: 3,
                    backoff: { type: 'exponential', delay: 2000 },
                    removeOnComplete: { age: 3600, count: 100 },
                    removeOnFail: { age: 86400 },
                },
            }),
        ],
        controllers: [ai_controller_1.AiController],
        providers: [
            provider_factory_1.ProviderFactory,
            ai_chat_service_1.AiChatService,
            ai_features_service_1.AiFeaturesService,
            ai_security_service_1.AiSecurityService,
            ai_analytics_service_1.AiAnalyticsService,
            memory_service_1.MemoryService,
            embedding_service_1.EmbeddingService,
            vector_store_service_1.VectorStoreService,
            rag_pipeline_service_1.RagPipelineService,
            document_processor_service_1.DocumentProcessor,
            ai_tools_service_1.AiToolsService,
            ai_processing_processor_1.AiProcessingProcessor,
        ],
        exports: [
            ai_chat_service_1.AiChatService,
            ai_features_service_1.AiFeaturesService,
            embedding_service_1.EmbeddingService,
            rag_pipeline_service_1.RagPipelineService,
            ai_tools_service_1.AiToolsService,
            provider_factory_1.ProviderFactory,
        ],
    })
], AiModule);
//# sourceMappingURL=ai.module.js.map