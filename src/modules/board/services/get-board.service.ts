import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ClsService } from 'nestjs-cls';
import { Board } from '../entities/database/board-table.entity';
import { Layout, OpponentSquareCurrentState, YourSquareCurrentState } from '../entities/dto/game-state-dto';

@Injectable()
export class GetBoardService {
    constructor(
        @InjectRepository(Board)
        private boardRepository: Repository<Board>,
        private readonly clsService: ClsService
    ) { }

    async getYourBoard(matchId: string): Promise<Layout> {
        const userId = this.clsService.get("userId");
        const board: YourSquareCurrentState[][] = Array.from({ length: 10 }, () => Array(10).fill({ piece: null, hit: false }));
        const layout: Layout = new Layout()
        layout.you = board;

        const rows = await this.boardRepository.createQueryBuilder('board')
            .select('board.row_number', 'row_number')
            .addSelect('board.column_number', 'column_number')
            .addSelect('board.piece', 'piece')
            .addSelect('board.hit', 'hit')
            .where(`board.match_id = '${matchId}' and board.user_id = '${userId}'`)
            .orderBy("row_number", "ASC")
            .addOrderBy("column_number", "ASC")
            .getRawMany();
        if (rows.length != 100) {
            throw new HttpException("Your board is not setup yet", HttpStatus.NOT_FOUND);
        }

        rows.forEach((square, index) => {
            const yourSquare = new YourSquareCurrentState()
            yourSquare.piece = square.piece;
            yourSquare.hit = square.hit;
            board[square.row_number][square.column_number] = yourSquare;
        })
        return layout;
    }

    async getOpponentBoard(matchId: string): Promise<Layout> {
        const userId = this.clsService.get("userId");
        const board: OpponentSquareCurrentState[][] = Array.from({ length: 10 }, () => Array(10).fill({ state: null }));
        const layout: Layout = new Layout()
        layout.opponent = board;

        const rows = await this.boardRepository.createQueryBuilder('board')
            .select('board.row_number', 'row_number')
            .addSelect('board.column_number', 'column_number')
            .addSelect(`CASE WHEN board.hit = true AND board.piece IS NOT NULL THEN 'HIT' WHEN board.hit = true AND board.piece IS NULL THEN 'MISS' ELSE NULL END`, 'state')
            .where(`board.match_id = '${matchId}' and board.user_id != '${userId}'`)
            .getRawMany();

        if (rows.length != 100) {
            throw new HttpException("Opponent's board not setup yet", HttpStatus.NOT_FOUND);
        }

        rows.forEach((square, index) => {
            const yourSquare = new OpponentSquareCurrentState()
            yourSquare.state = square.state;
            board[square.row_number][square.column_number] = yourSquare;
        })
        return layout;
    }
}
