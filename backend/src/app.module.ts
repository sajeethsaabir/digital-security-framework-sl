import { Module } from '@nestjs/common';
import { DbModule } from './db/db.module';
import { AuthModule } from './auth/auth.module';
import { ProgressModule } from './progress/progress.module';
import { SearchModule } from './search/search.module';
import { LearnModule } from './learn/learn.module';

@Module({
  imports: [DbModule, AuthModule, ProgressModule, SearchModule, LearnModule],
})
export class AppModule {}
