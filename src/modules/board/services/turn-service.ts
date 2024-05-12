import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ClsService } from 'nestjs-cls';
import { Match } from 'src/modules/match/entities/database/match.entity';

@Injectable()
export class TurnService {
    constructor(
        @InjectRepository(Match)
        private matchRepository: Repository<Match>,
        private readonly clsService: ClsService
    ) { }

    async isYourTurn(matchId: string): Promise<boolean> {
        // return true;
        const userId = this.clsService.get("userId");
        const playerTurn = await this.matchRepository.createQueryBuilder('match')
          .select(`CASE WHEN match.player_one_turn = true THEN match.player_one WHEN match.player_one_turn != true THEN match.player_two END`, 'player_turn')
          .where(`match.match_id = '${matchId}'`)
          .getRawOne();
        return playerTurn.player_turn === userId
      }

}