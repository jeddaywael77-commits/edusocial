import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Socket } from 'socket.io';
import { WsUser } from './ws-user.interface';

export const WsCurrentUser = createParamDecorator(
  (data: keyof WsUser | undefined, ctx: ExecutionContext) => {
    const client = ctx.switchToWs().getClient() as Socket;
    const user = (client.data as { user: WsUser })?.user;
    return data ? user?.[data] : user;
  },
);
