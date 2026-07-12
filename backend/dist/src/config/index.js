"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_config_1 = __importDefault(require("./app.config"));
const database_config_1 = __importDefault(require("./database.config"));
const redis_config_1 = __importDefault(require("./redis.config"));
const jwt_config_1 = __importDefault(require("./jwt.config"));
exports.default = [app_config_1.default, database_config_1.default, redis_config_1.default, jwt_config_1.default];
//# sourceMappingURL=index.js.map