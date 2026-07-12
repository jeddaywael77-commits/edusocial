import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Socket } from 'socket.io';

export const WsCurrentUser = createParamDecorator(
  (data: string | undefined, ctx: ExecutionContext) => {
    const client: Socket = ctx.switchToWs().getClient();
    const user = client.data?.user;
    return data ? user?.[data] : user;
  },
);
