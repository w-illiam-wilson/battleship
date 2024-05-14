import { Controller, Get, Query } from '@nestjs/common';
import { LeaderboardService } from './leaderboard.service';
import { LeaderboardDTO } from './entities/dto/leaderboard-dto.entity';
import { LeaderboardQuery } from './entities/dto/leaderboard-query.entity';

@Controller('/leaderboard')
export class LeaderboardController {
  constructor(private readonly matchService: LeaderboardService) {}

  @Get()
  async getLeaderboard(
    @Query() leaderboardQuery: LeaderboardQuery,
  ): Promise<LeaderboardDTO[]> {
    return await this.matchService.getLeaderboard(
      leaderboardQuery.userId,
      leaderboardQuery.limit,
    );
  }
}
