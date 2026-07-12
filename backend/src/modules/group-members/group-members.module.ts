import { Module } from '@nestjs/common';
import { GroupMembersController } from './group-members.controller';
import { GroupMembersService } from './group-members.service';
import { AuthModule } from '../auth/auth.module';
import { SocketModule } from '../socket/socket.module';

@Module({
  imports: [AuthModule, SocketModule],
  controllers: [GroupMembersController],
  providers: [GroupMembersService],
  exports: [GroupMembersService],
})
export class GroupMembersModule {}
