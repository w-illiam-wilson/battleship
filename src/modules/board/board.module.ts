import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Board } from './entities/database/board-table.entity';
import { MatchModule } from 'src/modules/match/match.module';
import { BoardController } from './board.controller';
import { BoardService } from './board.service';

@Module({
  imports: [TypeOrmModule.forFeature([Board]), MatchModule],
  controllers: [BoardController],
  providers: [BoardService],
})
export class BoardModule { }
