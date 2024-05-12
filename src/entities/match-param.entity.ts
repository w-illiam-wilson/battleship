import { IsUUID } from "class-validator";

export class MatchParam {
    @IsUUID()
    matchId: string;
  }