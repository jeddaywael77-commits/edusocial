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
exports.SearchConfigDto = exports.IndexEntityDto = exports.AutocompleteDto = exports.GlobalSearchDto = void 0;
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const swagger_1 = require("@nestjs/swagger");
class GlobalSearchDto {
    q;
    indexes;
    limit;
    offset;
    filters;
}
exports.GlobalSearchDto = GlobalSearchDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Search query' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], GlobalSearchDto.prototype, "q", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Filter by index types',
        example: ['users', 'posts'],
    }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], GlobalSearchDto.prototype, "indexes", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ minimum: 1, maximum: 100, default: 20 }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.Max)(100),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], GlobalSearchDto.prototype, "limit", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ minimum: 0, default: 0 }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], GlobalSearchDto.prototype, "offset", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Filter by specific field values' }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Object)
], GlobalSearchDto.prototype, "filters", void 0);
class AutocompleteDto {
    q;
    index;
    limit;
}
exports.AutocompleteDto = AutocompleteDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Search prefix' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], AutocompleteDto.prototype, "q", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Index to search in', default: 'users' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], AutocompleteDto.prototype, "index", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ minimum: 1, maximum: 20, default: 5 }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.Max)(20),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], AutocompleteDto.prototype, "limit", void 0);
class IndexEntityDto {
    entityType;
}
exports.IndexEntityDto = IndexEntityDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Entity type to index',
        enum: [
            'users',
            'posts',
            'courses',
            'groups',
            'marketplace',
            'documents',
            'lessons',
        ],
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], IndexEntityDto.prototype, "entityType", void 0);
class SearchConfigDto {
    entityType;
}
exports.SearchConfigDto = SearchConfigDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Entity type' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], SearchConfigDto.prototype, "entityType", void 0);
//# sourceMappingURL=search.dto.js.map