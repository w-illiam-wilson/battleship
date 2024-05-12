import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ClsService } from 'nestjs-cls';
import { Board } from '../entities/database/board-table.entity';
import { MissileDTO } from '../entities/dto/missile-dto.entity';
import { Match } from 'src/modules/match/entities/database/match.entity';
import { HitOrMiss, OpponentSquareCurrentStateDTO } from '../entities/dto/game-state-dto.entity';

@Injectable()
export class MissileService {
    constructor(
        @InjectRepository(Board)
        private boardRepository: Repository<Board>,
        @InjectRepository(Match)
        private matchRepository: Repository<Match>,
        private readonly clsService: ClsService
    ) { }

    async fireMissile(matchId, missile: MissileDTO): Promise<OpponentSquareCurrentStateDTO> {
        const userId = this.clsService.get("userId");
        const boardPieces = await this.boardRepository.findBy({ match_id: matchId, row_number: missile.row, column_number: missile.column });
        const oldBoardPiece = boardPieces.find(result => result.user_id !== userId);

        const newBoardPiece = new Board(this.boardRepository, this.matchRepository);
        newBoardPiece.match_id = oldBoardPiece.match_id;
        newBoardPiece.user_id = oldBoardPiece.user_id;
        newBoardPiece.row_number = oldBoardPiece.row_number;
        newBoardPiece.column_number = oldBoardPiece.column_number;
        newBoardPiece.piece = oldBoardPiece.piece;
        newBoardPiece.hit = true;

        await this.boardRepository.save(newBoardPiece);

        const opponentState: OpponentSquareCurrentStateDTO = {state: HitOrMiss.MISS};
        if (newBoardPiece.piece) {
            opponentState.state = HitOrMiss.HIT;
        }
        return opponentState;
    }
}
