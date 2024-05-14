import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ClsService } from 'nestjs-cls';
import { Board } from '../entities/repository/board.entity';
import {
  HitOrMiss,
  LayoutDTO,
  OpponentSquareCurrentStateDTO,
  YourSquareCurrentStateDTO,
} from '../entities/dto/game-state-dto.entity';

@Injectable()
export class GetBoardService {
  constructor(
    @InjectRepository(Board)
    private boardRepository: Repository<Board>,
    private readonly clsService: ClsService,
  ) {}

  async getYourBoard(matchId: string): Promise<LayoutDTO> {
    const userId = this.clsService.get('userId');
    const board: YourSquareCurrentStateDTO[][] = Array.from(
      { length: 10 },
      () => Array(10).fill({ piece: null, hit: false }),
    );
    const layout: LayoutDTO = new LayoutDTO();
    layout.you = board;

    const rows = await this.boardRepository
      .createQueryBuilder('board')
      .select('board.row_number', 'row_number')
      .addSelect('board.column_number', 'column_number')
      .addSelect('board.piece', 'piece')
      .addSelect('board.hit', 'hit')
      .where(`board.match_id = '${matchId}' and board.user_id = '${userId}'`)
      .orderBy('row_number', 'ASC')
      .addOrderBy('column_number', 'ASC')
      .getRawMany();

    if (rows.length != 100) {
      throw new HttpException(
        'Your board is not setup yet',
        HttpStatus.NOT_FOUND,
      );
    }

    rows.forEach((square, index) => {
      const yourSquare = new YourSquareCurrentStateDTO();
      yourSquare.piece = square.piece;
      yourSquare.hit = square.hit;
      board[square.row_number][square.column_number] = yourSquare;
    });
    return layout;
  }

  async getOpponentBoard(matchId: string): Promise<LayoutDTO> {
    const userId = this.clsService.get('userId');
    const board: OpponentSquareCurrentStateDTO[][] = Array.from(
      { length: 10 },
      () => Array(10).fill({ state: null }),
    );
    const layout: LayoutDTO = new LayoutDTO();
    layout.opponent = board;

    const squares = await this.boardRepository
      .createQueryBuilder('board')
      .select('board.row_number', 'row_number')
      .addSelect('board.column_number', 'column_number')
      .addSelect(
        `CASE WHEN board.hit = true AND board.piece IS NOT NULL THEN 'HIT' WHEN board.hit = true AND board.piece IS NULL THEN 'MISS' ELSE NULL END`,
        'state',
      )
      .where(`board.match_id = '${matchId}' and board.user_id != '${userId}'`)
      .getRawMany();

    if (squares.length != 100) {
      throw new HttpException(
        "Opponent's board not setup yet",
        HttpStatus.NOT_FOUND,
      );
    }

    squares.forEach((square) => {
      const yourSquare = new OpponentSquareCurrentStateDTO();
      yourSquare.state = HitOrMiss[square.state] ?? null;
      board[square.row_number][square.column_number] = yourSquare;
    });
    return layout;
  }
}
