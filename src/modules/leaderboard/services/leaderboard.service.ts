import { Injectable } from '@nestjs/common';
import { LeaderboardDTO } from '../entities/dto/leaderboard-dto.entity';
import { MatchRepository } from '../../match/repositories/match.repository';

@Injectable()
export class LeaderboardService {
  constructor(private readonly matchRepository: MatchRepository) {}

  async getLeaderboard(
    userId: string,
    limit?: number,
  ): Promise<LeaderboardDTO[]> {
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
      query += ` where user_id='${userId}'`;
    }

    query += ' GROUP BY matches.user_id';

    query += ' ORDER BY wins DESC';

    if (limit) {
      query += ` LIMIT ${limit}`;
    }

    return await this.matchRepository.query(query);
  }
}
