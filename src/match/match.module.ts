import { Module } from '@nestjs/common';
import { HistoryController } from './match.controller';
import { MatchService } from './match.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Match } from './entities/match-table.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Match])],
  controllers: [HistoryController],
  providers: [MatchService],
})
export class HistoryModule { }
