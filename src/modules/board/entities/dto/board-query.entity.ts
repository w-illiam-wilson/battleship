import { IsString } from "class-validator";

export class BoardQuery {
    @IsString()
    matchId: string
}