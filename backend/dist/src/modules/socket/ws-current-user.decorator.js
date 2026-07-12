"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WsCurrentUser = void 0;
const common_1 = require("@nestjs/common");
exports.WsCurrentUser = (0, common_1.createParamDecorator)((data, ctx) => {
    const client = ctx.switchToWs().getClient();
    const user = client.data?.user;
    return data ? user?.[data] : user;
});
//# sourceMappingURL=ws-current-user.decorator.js.map