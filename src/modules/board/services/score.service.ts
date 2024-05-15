import { Injectable } from '@nestjs/common';
import { ClsService } from 'nestjs-cls';
import { Score } from '../entities/dto/score-dto.entity';
import { BoardRepository } from '../repositories/board.repository';

@Injectable()
export class ScoreService {
  constructor(
    private readonly boardRepository: BoardRepository,
    private readonly clsService: ClsService,
  ) {}

  async getScores(matchId): Promise<Score> {
    const userId = this.clsService.get('userId');
    const results = await this.boardRepository.getScoreByMatchId(matchId);

    let opponentScore: number = results.find(
      (result) => result.user_id === userId,
    )?.score;
    let yourScore: number = results.find(
      (result) => result.user_id !== userId,
    )?.score;

    if (!yourScore) {
      yourScore = 18;
    }
    if (!opponentScore) {
      opponentScore = 18;
    }

    if (results.length != 2) {
      yourScore = 0;
      opponentScore = 0;
    }

    const score = new Score();
    score.you = Number(yourScore);
    score.opponent = Number(opponentScore);
    
    return score;
  }
}
