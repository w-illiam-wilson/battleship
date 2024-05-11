import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { BoardService } from './board.service';
import { SetupDTO } from './entities/setup-dto.entity';
import { ShipPiece } from './entities/ship.enum';

@Controller("/board")
export class BoardController {
  constructor(private readonly boardService: BoardService) {}

  @Post("/setup")
  async setupBoard(
    @Query("matchId") matchId: string,
    @Body() setup: SetupDTO
  ): Promise<ShipPiece [][]> {
    return await this.boardService.setupBoard(matchId, setup);
  }

  @Post("/fire")
  async getLeaderboard(
    @Query("limit") limit?: number
  ): Promise<string> {
    return ""
  }
}
