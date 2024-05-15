import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Match } from '../entities/repository/match.entity';
import { Repository } from 'typeorm';
import { ClsService } from 'nestjs-cls';
import { CreateMatchDTO } from '../entities/dto/match-dto.entity';
import { MatchRepository } from '../repositories/match.repository';

@Injectable()
export class MatchService {
  constructor(
    private readonly matchRepository: MatchRepository,
    private readonly clsService: ClsService,
  ) {}

  async createMatch(createMatchDTO: CreateMatchDTO): Promise<Match> {
    const player_one = this.clsService.get('userId');
    const player_two = createMatchDTO.player_two;

    if (player_one === player_two) {
      throw new HttpException(
        'Opponent must not be yourself',
        HttpStatus.BAD_REQUEST,
      );
    }

    const newMatch: Match = new Match();

    newMatch.player_one = player_one;
    newMatch.player_two = player_two;

    const createdMatch = await this.matchRepository.save(newMatch);
    return createdMatch;
  }

  async getMatch(matchId: string): Promise<Match> {
    const matches = await this.getMatches(
      undefined,
      undefined,
      matchId,
      undefined,
    );
    if (matches.length != 1) {
      throw new HttpException('Match not found', HttpStatus.NOT_FOUND);
    } else {
      return matches[0];
    }
  }

  async getMatches(
    userId: string,
    finished: boolean,
    matchId: string,
    limit: number,
  ): Promise<Match[]> {
    return await this.matchRepository.getMatchesByUserIdFinishedMatchId(
      userId,
      finished,
      matchId,
      limit,
    );
  }
}
