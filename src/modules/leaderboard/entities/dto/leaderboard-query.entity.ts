import { IsOptional, IsString } from 'class-validator';
import { LimitQuery } from 'src/entities/limit-query.entity';

export class LeaderboardQuery extends LimitQuery {
  @IsOptional()
  @IsString()
  userId?: string;
}
