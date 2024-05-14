import { IsNotEmpty, IsUUID } from 'class-validator';

export class MatchParam {
  @IsUUID()
  @IsNotEmpty()
  matchId: string;
}
