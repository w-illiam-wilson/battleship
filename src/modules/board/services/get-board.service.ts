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
import { BoardRepository } from '../repositories/board.repository';

@Injectable()
export class GetBoardService {
  constructor(
    private readonly boardRepository: BoardRepository,
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

    const rows = await this.boardRepository.getYourBoardByMatchIdUserId(matchId, userId);

    if (rows.length != 100) {
      throw new HttpException(
        'Your board is not setup yet',
        HttpStatus.NOT_FOUND,
      );
    }

    rows.forEach((square) => {
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

    const squares = await this.boardRepository.getOpponentBoardByMatchIdUserId(matchId, userId)

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
