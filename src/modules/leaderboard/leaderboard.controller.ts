import { Controller, Get, Query } from '@nestjs/common';
import { LeaderboardService } from './leaderboard.service';
import { LeaderboardDTO } from './entities/dto/leaderboard-dto.entity';
import { LimitQuery } from 'src/entities/limit-query.entity';


@Controller("/leaderboard")
export class LeaderboardController {
  constructor(private readonly matchService: LeaderboardService) {}

  @Get()
  async getLeaderboard(
    @Query() limitQuery: LimitQuery
  ): Promise<LeaderboardDTO[]> {
    return await this.matchService.getLeaderboard(limitQuery.limit);
  }
  
}
