import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Match } from './entities/match-table.entity';
import { Repository } from 'typeorm';
import { ClsService } from 'nestjs-cls';
import { LeaderboardDTO, MatchHistoryDTO } from './entities/match-dto.entity';

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

  async getCurrentMatches(): Promise<string> {
    const player_one = this.clsService.get("userId");
    const player_two = opponent;
    const newMatch = new Match();
    newMatch.player_one = player_one;
    newMatch.player_two = player_two;

    const createdMatch = await this.matchRepository.save(newMatch);
    return createdMatch.match_id;
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
    let query = this.matchRepository.createQueryBuilder('match_history')
      .select('match_history.match_time', 'match_time')
      .addSelect(`CASE WHEN match_history.match_winner = '${userId}' THEN TRUE ELSE FALSE END`, 'won')
      .addSelect(`CASE WHEN match_history.player_one = '${userId}' THEN match_history.player_two ELSE match_history.player_one END`, 'opponent')
      .where(`'${userId}' IN (match_history.player_one, match_history.player_two)`)
      .andWhere('match_history.match_winner IS NOT NULL')
      .orderBy('match_history.match_time', 'DESC')
    if (limit) {
      query = query.limit(limit);
    }

    return await query.getRawMany()
  }

}
