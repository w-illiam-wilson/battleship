import { Body, Controller, Get, Param, ParseBoolPipe, Post, Query } from '@nestjs/common';
import { MatchService } from './match.service';
import { CreateMatchDTO, MatchDTO } from './entities/dto/match-dto.entity';
import { LeaderboardDTO } from './entities/dto/leaderboard-dto.entity';
import { LimitQuery } from 'src/entities/limit-query.entity';
import { MatchQuery } from './entities/dto/match-query.entity';
import { MatchParam } from '../../entities/match-param.entity';

@Controller("/matches")
export class MatchController {
  constructor(private readonly matchService: MatchService) {}

  @Get("/leaderboard") //would change this - doesnt match api spec really
  async getLeaderboard(
    @Query() limitQuery: LimitQuery
  ): Promise<LeaderboardDTO[]> {
    return await this.matchService.getLeaderboard(limitQuery.limit);
  }

  @Get()
  async getMatches(
    @Query() matchQuery: MatchQuery,
  ): Promise<MatchDTO[]> {
    return await this.matchService.getMatches(matchQuery.userId, matchQuery.finished, matchQuery.limit);
  }

  @Get(':matchId')
  async getMatch(
    @Param() matchParam: MatchParam
  ): Promise<MatchDTO> {
    return await this.matchService.getMatch(matchParam.matchId);
  }

  @Post()
  async createMatch(
    @Body() createMatchDTO: CreateMatchDTO
  ): Promise<MatchDTO> {
    return await this.matchService.createMatch(createMatchDTO);
  }
  
}
