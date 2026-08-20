import { Module } from '@nestjs/common';
import { ProgressController } from './progress.controller';
import { AuthService } from '../auth/auth.service';

@Module({
  controllers: [ProgressController],
  providers: [AuthService],
})
export class ProgressModule {}
