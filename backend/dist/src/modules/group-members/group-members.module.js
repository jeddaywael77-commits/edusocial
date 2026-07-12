"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GroupMembersModule = void 0;
const common_1 = require("@nestjs/common");
const group_members_controller_1 = require("./group-members.controller");
const group_members_service_1 = require("./group-members.service");
const auth_module_1 = require("../auth/auth.module");
const socket_module_1 = require("../socket/socket.module");
let GroupMembersModule = class GroupMembersModule {
};
exports.GroupMembersModule = GroupMembersModule;
exports.GroupMembersModule = GroupMembersModule = __decorate([
    (0, common_1.Module)({
        imports: [auth_module_1.AuthModule, socket_module_1.SocketModule],
        controllers: [group_members_controller_1.GroupMembersController],
        providers: [group_members_service_1.GroupMembersService],
        exports: [group_members_service_1.GroupMembersService],
    })
], GroupMembersModule);
//# sourceMappingURL=group-members.module.js.map