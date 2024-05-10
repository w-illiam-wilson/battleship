import { Controller, Get, Query } from '@nestjs/common';
import { HistoryService } from './history.service';

@Controller("/history")
export class HistoryController {
  constructor(private readonly historyService: HistoryService) {}

  @Get("/leaderboard")
  getLeaderboard(
    @Query("limit") limit?: number
  ): string {
    return this.historyService.getLeaderboard(limit);
  }

  @Get("/matches")
  getHistory(
    @Query("user") userId: string,
    @Query("limit") limit?: number
  ): string {
    return this.historyService.getHistory(userId, limit);
  }
}
