import { Module } from '@nestjs/common';
import { StudyTunisiaController } from './study-tunisia.controller';
import { StudyTunisiaService } from './study-tunisia.service';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [AuthModule],
  controllers: [StudyTunisiaController],
  providers: [StudyTunisiaService],
  exports: [StudyTunisiaService],
})
export class StudyTunisiaModule {}
