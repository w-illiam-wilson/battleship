import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ClsService } from 'nestjs-cls';
import { Board } from './entities/database/board-table.entity';
import { SetupDTO } from './entities/dto/setup-dto.entity';
import { Match } from 'src/modules/match/entities/database/match-table.entity';
import { OpponentSquareCurrentState, GameState, YourSquareCurrentState, Layout, Score, GameStateRequest } from './entities/dto/game-state-dto';
import { MissileDTO } from './entities/dto/missile-dto.entity';
import { SetupBoardService } from './services/setup-board.service';
import { GetBoardService } from './services/get-board.service';
import { ScoreService } from './services/score.service';
import { TurnService } from './services/turn-service';
import { MissileService } from './services/missile.service';

@Injectable()
export class GameService {
  constructor(
    private readonly setupBoardService: SetupBoardService,
    private readonly getBoardService: GetBoardService,
    private readonly scoreService: ScoreService,
    private readonly missileService: MissileService,
    private readonly turnService: TurnService
  ) { }

  async setupBoard(matchId: string, setup: SetupDTO): Promise<GameState> {
    await this.setupBoardService.setupBoard(matchId, setup);
    return this.getGameState(new GameStateRequest({matchId: matchId, layout: true, you: true}))
  }

  async fireMissile(matchId, missile: MissileDTO): Promise<GameState> {
    const scores = await this.scoreService.getScores(matchId);
    try {
      await this.getGameState(new GameStateRequest({matchId: matchId, layout: true, opponent: true}))
    } catch {
      throw new HttpException("Boards haven't been set up yet", HttpStatus.FORBIDDEN)
    }
    if (scores.you == 18 || scores.opponent == 18) {
      throw new HttpException("Game has already finished", HttpStatus.FORBIDDEN)
    }
    if (!await this.turnService.isYourTurn(matchId)) {
      throw new HttpException("It's not your turn", HttpStatus.FORBIDDEN)
    }
    await this.missileService.fireMissile(matchId, missile)
    return await this.getGameState(new GameStateRequest({matchId: matchId, layout: true, opponent: true}))
  }

  async getGameState(gameStateRequest: GameStateRequest): Promise<GameState> {
    const {matchId, layout, score, you, opponent} = gameStateRequest;
    const gameState = new GameState();
    if (layout) {
      gameState.layout = new Layout();
      if (you) {
        gameState.layout.you = (await this.getBoardService.getYourBoard(matchId)).you
      }
      if (opponent) {
        gameState.layout.opponent = (await this.getBoardService.getOpponentBoard(matchId)).opponent
      }
    }
    if (score) {
      gameState.score = new Score();
      const scores = await this.scoreService.getScores(matchId);
      console.log(scores)
      if (you) {
        gameState.score.you = scores.you
      }
      if (opponent) {
        gameState.score.opponent = scores.opponent
      }
    }
    return gameState;
  }
}
