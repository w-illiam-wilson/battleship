import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { MatchService } from './match.service';
import { CreateMatchDTO } from './entities/dto/match-dto.entity';
import { MatchQuery } from './entities/dto/match-query.entity';
import { MatchParam } from '../../entities/match-param.entity';
import { Match } from './entities/database/match.entity';

@Controller("/matches")
export class MatchController {
  constructor(private readonly matchService: MatchService) {}

  @Get()
  async getMatches(
    @Query() matchQuery: MatchQuery,
  ): Promise<Match[]> {
    return await this.matchService.getMatches(matchQuery.userId, matchQuery.finished, matchQuery.limit);
  }

  @Get(':matchId')
  async getMatch(
    @Param() matchParam: MatchParam
  ): Promise<Match> {
    return await this.matchService.getMatch(matchParam.matchId);
  }

  @Post()
  async createMatch(
    @Body() createMatchDTO: CreateMatchDTO
  ): Promise<Match> {
    return await this.matchService.createMatch(createMatchDTO);
  }
  
}
