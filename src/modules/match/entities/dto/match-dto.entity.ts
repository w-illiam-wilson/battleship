import { IsNotEmpty, IsString } from "class-validator";

export class CreateMatchDTO {
    @IsString()
    @IsNotEmpty()
    player_two: string;
}

export class MatchDTO {
    match_id: string;
    match_time: Date;
    player_one: string;
    player_two: string
    player_one_turn: boolean;
    match_winner: string;
}