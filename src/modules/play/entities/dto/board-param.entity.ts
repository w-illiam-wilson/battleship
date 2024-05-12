import { IsString } from "class-validator";

export class BoardParam {
    @IsString()
    matchId: string
}