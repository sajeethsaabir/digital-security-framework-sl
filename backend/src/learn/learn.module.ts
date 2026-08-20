import { Module } from '@nestjs/common';
import { LearnController } from './learn.controller';
import { AuthService } from '../auth/auth.service';

@Module({
  controllers: [LearnController],
  providers: [AuthService],
})
export class LearnModule {}
