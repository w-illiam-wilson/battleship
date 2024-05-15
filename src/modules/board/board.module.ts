import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Board } from './entities/repository/board.entity';
import { MatchModule } from 'src/modules/match/match.module';
import { BoardsController } from './controllers/board.controller';
import { BoardService } from './services/board.service';
import { SetupBoardService } from './services/setup-board.service';
import { GetBoardService } from './services/get-board.service';
import { ScoreService } from './services/score.service';
import { MissileService } from './services/missile.service';
import { TurnService } from './services/turn-service';
import { BoardRepository } from './repositories/board.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Board]), MatchModule],
  controllers: [BoardsController],
  providers: [
    BoardRepository,
    BoardService,
    SetupBoardService,
    GetBoardService,
    ScoreService,
    MissileService,
    TurnService,
  ],
})
export class BoardModule {}
