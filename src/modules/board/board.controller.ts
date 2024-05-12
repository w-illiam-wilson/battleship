import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { BoardService } from './board.service';
import { SetupDTO } from './entities/dto/setup-dto.entity';
import { MissileDTO } from './entities/dto/missile-dto.entity';
import { GameState, GameStateRequest } from './entities/dto/game-state-dto';
import { MatchParam } from 'src/entities/match-param.entity';

@Controller("/boards")
export class BoardsController {
  constructor(private readonly gameService: BoardService) {}

  @Get(":matchId/layout/you")
  async getBoardsLayoutYou(
    @Param() matchParam: MatchParam,
  ): Promise<GameState> {
    const gameStateRequest = new GameStateRequest({
      matchId: matchParam.matchId,
      layout: true,
      you: true
    });
    return await this.gameService.getGameState(gameStateRequest);
  }

  @Post(":matchId/layout/you")
  async setupBoard(
    @Param() matchParam: MatchParam,
    @Body() setup: SetupDTO
  ): Promise<GameState> {
    return await this.gameService.setupBoard(matchParam.matchId, setup);
  }

  @Get(":matchId/layout/opponent")
  async getBoardsLayoutOpponent(
    @Param() matchParam: MatchParam,
  ): Promise<GameState> {
    const gameStateRequest = new GameStateRequest({
      matchId: matchParam.matchId,
      layout: true,
      opponent: true
    });
    return await this.gameService.getGameState(gameStateRequest);
  }

  @Post(":matchId/layout/opponent")
  async fireMissile(
    @Param() matchParam: MatchParam,
    @Body() missile: MissileDTO
  ): Promise<GameState> {
    return await this.gameService.fireMissile(matchParam.matchId, missile);
  }

  @Get(":matchId/layout")
  async getBoardsLayout(
    @Param() matchParam: MatchParam,
  ): Promise<GameState> {
    const gameStateRequest = new GameStateRequest({
      matchId: matchParam.matchId,
      layout: true,
      you: true,
      opponent: true
    });
    return await this.gameService.getGameState(gameStateRequest);
  }

  @Get(":matchId/score/you")
  async getBoardsScoreYou(
    @Param() matchParam: MatchParam,
  ): Promise<GameState> {
    const gameStateRequest = new GameStateRequest({
      matchId: matchParam.matchId,
      score: true,
      you: true,
    });
    return await this.gameService.getGameState(gameStateRequest);
  }

  @Get(":matchId/score/opponent")
  async getBoardsScoreOpponent(
    @Param() matchParam: MatchParam,
  ): Promise<GameState> {
    const gameStateRequest = new GameStateRequest({
      matchId: matchParam.matchId,
      score: true,
      opponent: true,
    });
    return await this.gameService.getGameState(gameStateRequest);
  }

  @Get(":matchId/score")
  async getBoardsScore(
    @Param() matchParam: MatchParam,
  ): Promise<GameState> {
    const gameStateRequest = new GameStateRequest({
      matchId: matchParam.matchId,
      score: true,
      you: true,
      opponent: true
    });
    return await this.gameService.getGameState(gameStateRequest);
  }

  @Get(":matchId")
  async getBoards(
    @Param() matchParam: MatchParam,
  ): Promise<GameState> {
    const gameStateRequest = new GameStateRequest({
      matchId: matchParam.matchId,
      layout: true,
      score: true,
      you: true,
      opponent: true
    });
    return await this.gameService.getGameState(gameStateRequest);
  }
}
