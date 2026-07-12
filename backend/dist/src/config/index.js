"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_config_1 = __importDefault(require("./app.config"));
const database_config_1 = __importDefault(require("./database.config"));
const redis_config_1 = __importDefault(require("./redis.config"));
const jwt_config_1 = __importDefault(require("./jwt.config"));
const media_config_1 = __importDefault(require("./media.config"));
const search_config_1 = __importDefault(require("./search.config"));
const ai_config_1 = __importDefault(require("./ai.config"));
exports.default = [
    app_config_1.default,
    database_config_1.default,
    redis_config_1.default,
    jwt_config_1.default,
    media_config_1.default,
    search_config_1.default,
    ai_config_1.default,
];
//# sourceMappingURL=index.js.map