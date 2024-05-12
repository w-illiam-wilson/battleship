import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { BoardService } from './board.service';
import { SetupDTO } from './entities/setup-dto.entity';
import { MissileDTO } from './entities/fire-dto.entity';
import { OpponentBoard, ViewableBoard, YourBoard } from './entities/viewable-board-dto.entity';
import { BoardQuery } from './entities/dto/board-query.entity';

@Controller("/boards")
export class BoardController {
  constructor(private readonly boardService: BoardService) {}

  @Get()
  async getBoards(
    @Query() boardQuery: BoardQuery
  ): Promise<ViewableBoard> {
    return await this.boardService.getBoards(boardQuery.matchId);
  }

  @Post()
  async setupBoard(
    @Query() boardQuery: BoardQuery,
    @Body() setup: SetupDTO
  ): Promise<YourBoard> {
    return await this.boardService.setupBoard(boardQuery.matchId, setup);
  }

  @Post("/fire-missile")
  async getLeaderboard(
    @Query() boardQuery: BoardQuery,
    @Body() missile: MissileDTO
  ): Promise<OpponentBoard | string> {
    return await this.boardService.fireMissile(boardQuery.matchId, missile);
  }
}
