import { Controller, Get, Post, Query } from '@nestjs/common';
import { MatchService } from './match.service';
import { LeaderboardDTO, MatchDTO, MatchHistoryDTO } from './entities/match-dto.entity';

@Controller("/matches")
export class MatchController {
  constructor(private readonly matchService: MatchService) {}

  @Post("/start")
  async startMatch(
    @Query("opponent") opponent?: string
  ): Promise<string> {
    return await this.matchService.startMatch(opponent);
  }

  @Get("/leaderboard")
  async getLeaderboard(
    @Query("limit") limit?: number
  ): Promise<LeaderboardDTO[]> {
    return await this.matchService.getLeaderboard(limit);
  }

  @Get("/current")
  async getCurrentMatches(
  ): Promise<MatchDTO[]> {
    return await this.matchService.getCurrentMatches();
  }

  @Get("/history")
  getHistory(
    @Query("userId") userId: string,
    @Query("limit") limit?: number
  ): Promise<MatchHistoryDTO[]> {
    return this.matchService.getHistory(userId, limit);
  }
  
}
