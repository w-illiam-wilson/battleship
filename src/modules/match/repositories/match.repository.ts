// user.repository.ts
import { DataSource, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { Match } from '../entities/repository/match.entity';

@Injectable()
export class MatchRepository extends Repository<Match> {
  constructor(private dataSource: DataSource) {
    super(Match, dataSource.createEntityManager());
  }

  async getMatchesByUserIdFinishedMatchId(
    userId: string,
    finished: boolean,
    matchId: string,
    limit: number,
  ): Promise<Match[]> {
    const query = this.createQueryBuilder('match')
      .select('match.match_id', 'match_id')
      .addSelect('match.match_time', 'match_time')
      .addSelect('match.player_one', 'player_one')
      .addSelect('match.player_two', 'player_two')
      .addSelect('match.player_one_turn', 'player_one_turn')
      .addSelect('match.match_winner', 'match_winner');

    if (userId) {
      query.andWhere(
        `(match.player_one = '${userId}' OR match.player_two = '${userId}')`,
      );
    }
    if (finished === false) {
      query.andWhere('match.match_winner IS NULL');
    } else if (finished === true) {
      query.andWhere('match.match_winner IS NOT NULL');
    }

    if (matchId) {
      query.andWhere(`match.match_id ='${matchId}'`);
    }

    query.orderBy('match.match_time', 'DESC');

    if (limit) {
      query.limit(limit);
    }

    return await query.getRawMany();
  }
}
