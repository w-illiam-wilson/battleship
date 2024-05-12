import { Body, Controller, Get, ParseBoolPipe, Post, Query } from '@nestjs/common';
import { MatchService } from './match.service';
import { CreateMatchDTO, MatchDTO } from './entities/match-dto.entity';
import { LeaderboardDTO } from './entities/leaderboard-dto.entity';
import { MatchQuery } from './entities/match-query.entity';

@Controller("/matches")
export class MatchController {
  constructor(private readonly matchService: MatchService) {}

  @Get()
  async getMatches(
    // @Query() matchQuery: MatchQuery
    @Query("userId") userId?: string,
    @Query("current", new ParseBoolPipe({optional: true})) current?: boolean,
    @Query("limit") limit?: number
  ): Promise<MatchDTO[]> {
    return await this.matchService.getMatches(userId, current, limit);
  }

  @Post()
  async createMatch(
    @Body() createMatchDTO: CreateMatchDTO
  ): Promise<MatchDTO> {
    return await this.matchService.createMatch(createMatchDTO);
  }

  @Get("/leaderboard")
  async getLeaderboard(
    @Query("limit") limit?: number
  ): Promise<LeaderboardDTO[]> {
    return await this.matchService.getLeaderboard(limit);
  }
  
}
