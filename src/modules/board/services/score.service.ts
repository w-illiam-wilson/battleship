import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ClsService } from 'nestjs-cls';
import { Board } from '../entities/database/board-table.entity';
import { Score } from '../entities/dto/score-dto.entity';

@Injectable()
export class ScoreService {
    constructor(
        @InjectRepository(Board)
        private boardRepository: Repository<Board>,
        private readonly clsService: ClsService
    ) { }

    async getScores(matchId): Promise<Score> {
        const userId = this.clsService.get("userId");
        const results = await this.boardRepository
            .createQueryBuilder('board')
            .select('board.user_id', 'user_id')
            .addSelect('18 - COUNT(*)', 'score')
            .where(`board.match_id = '${matchId}'`)
            .andWhere('board.hit = false and board.piece is NOT NULL')
            .groupBy('board.user_id')
            .getRawMany();
        let opponentScore: number = results.find(result => result.user_id === userId)?.score;
        let yourScore: number = results.find(result => result.user_id !== userId)?.score;
        if (!yourScore) {
            yourScore = 18
        }
        if (!opponentScore) {
            opponentScore = 18
        }
        if (results.length != 2) {
            yourScore = 0
            opponentScore = 0
        }
        const score = new Score();
        score.you = Number(yourScore);
        score.opponent = Number(opponentScore);
        return score;
    }
}
