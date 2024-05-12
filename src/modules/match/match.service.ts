import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Match } from './entities/database/match.entity';
import { Repository } from 'typeorm';
import { ClsService } from 'nestjs-cls';
import { CreateMatchDTO } from './entities/dto/match-dto.entity';

@Injectable()
export class MatchService {
  constructor(
    @InjectRepository(Match)
    private matchRepository: Repository<Match>,
    private readonly clsService: ClsService
  ) { }

  async createMatch(createMatchDTO: CreateMatchDTO): Promise<Match> {
    const player_one = this.clsService.get("userId");
    const player_two = createMatchDTO.player_two;

    if (player_one === player_two) {
      throw new HttpException("You cannot play yourself", HttpStatus.BAD_REQUEST);
    }

    const newMatch: Match = new Match();

    newMatch.player_one = player_one;
    newMatch.player_two = player_two;

    const createdMatch = await this.matchRepository.save(newMatch);
    return createdMatch;
  }

  async getMatch(matchId: string): Promise<Match> {
    const matches = await this.getMatches(undefined, undefined, undefined, matchId);
    if (matches.length != 1) {
      throw new HttpException("Match not found", HttpStatus.NOT_FOUND)
    } else {
      return matches[0]
    }
  }

  async getMatches(userId: string, finished: boolean, limit: number, matchId?: string): Promise<Match[]> {
    const query = this.matchRepository.createQueryBuilder('match')
      .select('match.match_id', 'match_id')
      .addSelect('match.match_time', 'match_time')
      .addSelect('match.player_one', 'player_one')
      .addSelect('match.player_two', 'player_two')
      .addSelect('match.player_one_turn', 'player_one_turn')
      .addSelect('match.match_winner', 'match_winner')
    if (userId) {
      query.andWhere(`(match.player_one = '${userId}' OR match.player_two = '${userId}')`)
    }
    if (finished === false) {
      query.andWhere('match.match_winner IS NULL')
    } else if (finished === true) {
      query.andWhere('match.match_winner IS NOT NULL')
    }
    if (matchId) {
      query.andWhere(`match.match_id ='${matchId}'`)
    }
    query.orderBy('match.match_time', 'DESC')
    if (limit) {
      query.limit(limit)
    }

    return await query.getRawMany()
  }
}
