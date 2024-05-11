import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { BoardService } from './board.service';
import { SetupDTO } from './entities/setup-dto.entity';
import { ShipPiece } from './entities/ship.entity';
import { MissileDTO } from './entities/fire-dto.entity';
import { OpponentBoard, OpponentSquareCurrentState, ViewableBoard, YourBoard } from './entities/viewable-board-dto.entity';

@Controller("/boards")
export class BoardController {
  constructor(private readonly boardService: BoardService) {}

  @Get()
  async getBoards(
    @Query("matchId") matchId: string,
  ): Promise<ViewableBoard> {
    return await this.boardService.getBoards(matchId);
  }

  @Post("/setup")
  async setupBoard(
    @Query("matchId") matchId: string,
    @Body() setup: SetupDTO
  ): Promise<YourBoard> {
    return await this.boardService.setupBoard(matchId, setup);
  }

  @Post("/fire-missile")
  async getLeaderboard(
    @Query("matchId") matchId: string,
    @Body() missile: MissileDTO
  ): Promise<OpponentBoard | string> {
    return await this.boardService.fireMissile(matchId, missile);
  }
}
