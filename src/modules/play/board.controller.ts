import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { GameService } from './game.service';
import { SetupDTO } from './entities/dto/setup-dto.entity';
import { MissileDTO } from './entities/dto/missile-dto.entity';
import { GameState, GameStateRequest } from './entities/dto/game-state-dto';
import { BoardParam } from './entities/dto/board-param.entity';

@Controller("/boards")
export class BoardsController {
  constructor(private readonly gameService: GameService) {}

  @Get(":matchId/layout/you")
  async getBoardsLayoutYou(
    @Param() boardParam: BoardParam,
  ): Promise<GameState> {
    const gameStateRequest = new GameStateRequest({
      matchId: boardParam.matchId,
      layout: true,
      you: true
    });
    return await this.gameService.getGameState(gameStateRequest);
  }

  @Post(":matchId/layout/you")
  async setupBoard(
    @Param() boardParam: BoardParam,
    @Body() setup: SetupDTO
  ): Promise<GameState> {
    return await this.gameService.setupBoard(boardParam.matchId, setup);
  }

  @Get(":matchId/layout/opponent")
  async getBoardsLayoutOpponent(
    @Param() boardParam: BoardParam,
  ): Promise<GameState> {
    const gameStateRequest = new GameStateRequest({
      matchId: boardParam.matchId,
      layout: true,
      opponent: true
    });
    return await this.gameService.getGameState(gameStateRequest);
  }

  @Post(":matchId/layout/opponent")
  async fireMissile(
    @Param() boardParam: BoardParam,
    @Body() missile: MissileDTO
  ): Promise<GameState> {
    console.log("firing missile")
    return await this.gameService.fireMissile(boardParam.matchId, missile);
  }

  @Get(":matchId/layout")
  async getBoardsLayout(
    @Param() boardParam: BoardParam,
  ): Promise<GameState> {
    const gameStateRequest = new GameStateRequest({
      matchId: boardParam.matchId,
      layout: true,
      you: true,
      opponent: true
    });
    return await this.gameService.getGameState(gameStateRequest);
  }

  @Get(":matchId/score/you")
  async getBoardsScoreYou(
    @Param() boardParam: BoardParam,
  ): Promise<GameState> {
    const gameStateRequest = new GameStateRequest({
      matchId: boardParam.matchId,
      score: true,
      you: true,
    });
    return await this.gameService.getGameState(gameStateRequest);
  }

  @Get(":matchId/score/opponent")
  async getBoardsScoreOpponent(
    @Param() boardParam: BoardParam,
  ): Promise<GameState> {
    const gameStateRequest = new GameStateRequest({
      matchId: boardParam.matchId,
      score: true,
      opponent: true,
    });
    return await this.gameService.getGameState(gameStateRequest);
  }

  @Get(":matchId/score")
  async getBoardsScore(
    @Param() boardParam: BoardParam,
  ): Promise<GameState> {
    const gameStateRequest = new GameStateRequest({
      matchId: boardParam.matchId,
      score: true,
      you: true,
      opponent: true
    });
    return await this.gameService.getGameState(gameStateRequest);
  }

  @Get(":matchId")
  async getBoards(
    @Param() boardParam: BoardParam,
  ): Promise<GameState> {
    const gameStateRequest = new GameStateRequest({
      matchId: boardParam.matchId,
      layout: true,
      score: true,
      you: true,
      opponent: true
    });
    return await this.gameService.getGameState(gameStateRequest);
  }
}
