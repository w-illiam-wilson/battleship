import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ClsService } from 'nestjs-cls';
import { Board } from '../entities/database/board-table.entity';
import { MissileDTO } from '../entities/dto/missile-dto.entity';

@Injectable()
export class MissileService {
    constructor(
        @InjectRepository(Board)
        private boardRepository: Repository<Board>,
        private readonly clsService: ClsService
    ) { }

    async fireMissile(matchId, missile: MissileDTO) {
        const userId = this.clsService.get("userId");
        await this.boardRepository
            .createQueryBuilder()
            .update(Board)
            .set({ hit: true })
            .where(`board.match_id = '${matchId}' and board.user_id != '${userId}' and board.row_number = ${missile.row} and board.column_number = ${missile.column}`)
            .execute();
    }
}
