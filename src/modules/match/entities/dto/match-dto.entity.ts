import { IsNotEmpty, IsString } from "class-validator";

export class CreateMatchDTO {
    @IsString()
    @IsNotEmpty()
    player_two: string;
}