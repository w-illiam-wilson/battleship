import { IsIn, IsNotEmpty, IsNumber, IsString, Max, Min } from "class-validator";

export class MissileDTO {
    //this is the left most and upper most position of the boat
    @IsNumber()
    @IsNotEmpty()
    @Min(0)
    @Max(9)
    row: number;

    @IsNumber()
    @IsNotEmpty()
    @Min(0)
    @Max(9)
    column: number;
}