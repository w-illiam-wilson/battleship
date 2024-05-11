import { IsString } from "class-validator";

export class CreateMatchDTO {
    @IsString()
    opponent: string;
}

export class MatchDTO {
    match_id: string;
    player_one: string;
    player_two: string
    player_one_turn: boolean;
}

export class MatchHistoryDTO {
    match_time: Date;
    won: boolean;
    opponent: string;
}

export class LeaderboardDTO {
    player: string;
    wins: string;
}