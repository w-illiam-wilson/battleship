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

  async getLeaderboard(userId: string, limit?: number): Promise<LeaderboardDTO[]> {
    let query = `
    SELECT 
        matches.user_id,
        CAST(COALESCE(SUM(CASE WHEN matches.match_winner = matches.user_id THEN 1 ELSE 0 END), 0) AS INT) AS wins,
        CAST(COALESCE(SUM(CASE WHEN matches.match_winner != matches.user_id THEN 1 ELSE 0 END), 0) AS INT) AS losses
    FROM (
        SELECT player_one AS user_id, match_winner FROM match
        UNION ALL
        SELECT player_two AS user_id, match_winner FROM match
    ) AS matches`;
    if (userId) {
      query += ` where user_id='${userId}'`
    }
    query += ' GROUP BY matches.user_id'
    if (limit) {
      query += ` LIMIT ${limit}`
    }
    
    return this.matchRepository.query(query);
    
  }
}
