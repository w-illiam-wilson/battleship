import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Match } from './entities/match-table.entity';
import { Repository } from 'typeorm';
import { ClsService } from 'nestjs-cls';
import { LeaderboardDTO, MatchDTO, MatchHistoryDTO } from './entities/match-dto.entity';

@Injectable()
export class MatchService {
  constructor(
    @InjectRepository(Match)
    private matchRepository: Repository<Match>,
    private readonly clsService: ClsService
  ) { }

  async startMatch(opponent: string): Promise<string> {
    const player_one = this.clsService.get("userId");
    const player_two = opponent;
    const newMatch = new Match();
    newMatch.player_one = player_one;
    newMatch.player_two = player_two;

    const createdMatch = await this.matchRepository.save(newMatch);
    return createdMatch.match_id;
  }

  async getCurrentMatches(): Promise<MatchDTO[]> {
    const userId = this.clsService.get("userId");
    return await this.matchRepository.createQueryBuilder('match')
      .select('match.match_id', 'match_id')
      .addSelect('match.player_one', 'player_one')
      .addSelect('match.player_two', 'player_two')
      .addSelect('match.player_one_turn', 'player_one_turn')
      .where('match.match_winner IS NULL')
      .andWhere(`match.player_one = '${userId}' OR match.player_two = '${userId}'`)
      .orderBy('match.match_time', 'DESC')
      .getRawMany()
  }

  async getLeaderboard(limit?: number): Promise<LeaderboardDTO[]> {
    let query = this.matchRepository.createQueryBuilder('match')
      .select('match.match_winner', 'player')
      .addSelect('COUNT(*)', 'wins')
      .where('match.match_winner IS NOT NULL')
      .groupBy('match.match_winner')
      .orderBy('wins', 'DESC')
    if (limit) {
      query = query.limit(limit);
    }

    return await query.getRawMany()
  }

  async getHistory(userId: string, limit?: number): Promise<MatchHistoryDTO[]> {
    let query = this.matchRepository.createQueryBuilder('match')
      .select('match.match_time', 'match_time')
      .addSelect(`CASE WHEN match.match_winner = '${userId}' THEN TRUE ELSE FALSE END`, 'won')
      .addSelect(`CASE WHEN match.player_one = '${userId}' THEN match.player_two ELSE match.player_one END`, 'opponent')
      .where(`'${userId}' IN (match.player_one, match.player_two)`)
      .andWhere('match.match_winner IS NOT NULL')
      .orderBy('match.match_time', 'DESC')
    if (limit) {
      query = query.limit(limit);
    }

    return await query.getRawMany()
  }

}
