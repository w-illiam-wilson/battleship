import { Module } from '@nestjs/common';
import { MatchController } from './controllers/match.controller';
import { MatchService } from './services/match.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Match } from './entities/repository/match.entity';
import { MatchRepository } from './repositories/match.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Match])],
  controllers: [MatchController],
  providers: [MatchService, MatchRepository],
  exports: [TypeOrmModule, MatchRepository],
})
export class MatchModule {}
