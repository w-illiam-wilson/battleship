import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { SetupDTO } from './entities/dto/setup-dto.entity';
import { GameStateDTO, LayoutDTO } from './entities/dto/game-state-dto.entity';
import { MissileDTO } from './entities/dto/missile-dto.entity';
import { SetupBoardService } from './services/setup-board.service';
import { GetBoardService } from './services/get-board.service';
import { ScoreService } from './services/score.service';
import { TurnService } from './services/turn-service';
import { MissileService } from './services/missile.service';
import { Score } from './entities/dto/score-dto.entity';
import { GameStateRequest } from './entities/util/game-state-request.entity';

@Injectable()
export class BoardService {
  constructor(
    private readonly setupBoardService: SetupBoardService,
    private readonly getBoardService: GetBoardService,
    private readonly scoreService: ScoreService,
    private readonly missileService: MissileService,
    private readonly turnService: TurnService
  ) { }

  async setupBoard(matchId: string, setup: SetupDTO): Promise<GameStateDTO> {
    await this.setupBoardService.setupBoard(matchId, setup);
    return this.getGameState(new GameStateRequest({matchId: matchId, layout: true, you: true}))
  }

  async fireMissile(matchId, missile: MissileDTO): Promise<GameStateDTO> {
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

  async getGameState(gameStateRequest: GameStateRequest): Promise<GameStateDTO> {
    const {matchId, layout, score, you, opponent} = gameStateRequest;
    const gameState = new GameStateDTO();
    if (layout) {
      gameState.layout = new LayoutDTO();
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
