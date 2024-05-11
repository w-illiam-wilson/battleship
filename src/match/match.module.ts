import { Module } from '@nestjs/common';
import { MatchController } from './match.controller';
import { MatchService } from './match.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Match } from './entities/match-table.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Match])],
  controllers: [MatchController],
  providers: [MatchService],
})
export class MatchModule { }
