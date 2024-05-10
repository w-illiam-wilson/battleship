
import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { Setup } from './entities/setup.entity';
import { Score } from './entities/score.entity';
import { PlayService } from './play.service';

@Controller("/play")
export class PlayController {
  constructor(private readonly playService: PlayService) {}

  @Post("/start")
  startGame(
    @Query("opponent") opponent: string,
  ): string {
    //creates a match and sets up board with nothing in it
    return "";
  }

  @Post("/setup")
  setup(
    @Body() setup: Setup,
  ): string {
    //sets up board with desired positions
    return "";
  }

  @Get("/score")
  async score(

  ): Promise<Score> {
    return {you: 1, opponent: 1}
  }

  @Post("/fire")
  getHistory(

  ): string {
    return "";
  }
}

