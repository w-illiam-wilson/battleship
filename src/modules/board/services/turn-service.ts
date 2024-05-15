import { Injectable } from '@nestjs/common';
import { ClsService } from 'nestjs-cls';
import { MatchRepository } from 'src/modules/match/repositories/match.repository';

@Injectable()
export class TurnService {
  constructor(
    private readonly matchRepository: MatchRepository,
    private readonly clsService: ClsService,
  ) {}

  async isYourTurn(matchId: string): Promise<boolean> {
    const userId = this.clsService.get('userId');
    const playerTurn = await this.matchRepository
      .createQueryBuilder('match')
      .select(
        `CASE WHEN match.player_one_turn = true THEN match.player_one WHEN match.player_one_turn != true THEN match.player_two END`,
        'player_turn',
      )
      .where(`match.match_id = '${matchId}'`)
      .getRawOne();

    return playerTurn.player_turn === userId;
  }
}
