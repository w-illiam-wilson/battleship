import { Module } from '@nestjs/common';
import { LeaderboardService } from './services/leaderboard.service';
import { LeaderboardController } from './controllers/leaderboard.controller';
import { MatchModule } from 'src/modules/match/match.module';

@Module({
  imports: [MatchModule],
  controllers: [LeaderboardController],
  providers: [LeaderboardService],
})
export class LeaderboardModule {}
