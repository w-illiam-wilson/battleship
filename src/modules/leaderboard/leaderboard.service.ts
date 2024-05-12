import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LeaderboardDTO } from './entities/dto/leaderboard-dto.entity';
import { Match } from '../match/entities/database/match.entity';

@Injectable()
export class LeaderboardService {
  constructor(
    @InjectRepository(Match)
    private matchRepository: Repository<Match>,
  ) { }

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
}
