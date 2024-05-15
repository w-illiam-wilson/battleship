// user.repository.ts
import { DataSource, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { Board } from '../entities/repository/board.entity';

@Injectable()
export class BoardRepository extends Repository<Board> {
  constructor(private dataSource: DataSource) {
    super(Board, dataSource.createEntityManager());
  }

  async getYourBoardByMatchIdUserId(
    matchId: string,
    userId: string
  ) {
    return await this
      .createQueryBuilder('board')
      .select('board.row_number', 'row_number')
      .addSelect('board.column_number', 'column_number')
      .addSelect('board.piece', 'piece')
      .addSelect('board.hit', 'hit')
      .where(`board.match_id = '${matchId}' and board.user_id = '${userId}'`)
      .orderBy('row_number', 'ASC')
      .addOrderBy('column_number', 'ASC')
      .getRawMany();
  }

  async getOpponentBoardByMatchIdUserId(
    matchId: string,
    userId: string
  ) {
    return await this
      .createQueryBuilder('board')
      .select('board.row_number', 'row_number')
      .addSelect('board.column_number', 'column_number')
      .addSelect(
        `CASE WHEN board.hit = true AND board.piece IS NOT NULL THEN 'HIT' WHEN board.hit = true AND board.piece IS NULL THEN 'MISS' ELSE NULL END`,
        'state',
      )
      .where(`board.match_id = '${matchId}' and board.user_id != '${userId}'`)
      .getRawMany();
  }

  async getScoreByMatchId(
    matchId: string
  ) {
    return await this
    .createQueryBuilder('board')
    .select('board.user_id', 'user_id')
    .addSelect('18 - COUNT(*)', 'score')
    .where(`board.match_id = '${matchId}'`)
    .andWhere('board.hit = false and board.piece is NOT NULL')
    .groupBy('board.user_id')
    .getRawMany();
  }

  async getPiecesPlacedOnBoardByMatchIdUserId(
    matchId: string,
    userId: string
  ) {
    return await this
      .createQueryBuilder('board')
      .where('board.match_id = :matchId', { matchId })
      .andWhere('board.user_id = :userId', { userId })
      .andWhere('board.piece IS NOT NULL')
      .getCount()
  }
}
