import { IsIn, IsNotEmpty, IsNumber, IsString, Max, Min } from "class-validator";

const rightOrDown = ['RIGHT', 'DOWN'];

export class Position {
    //this is the left most and upper most position of the boat
    @IsNumber()
    @Min(0)
    @Max(9)
    row: number;

    @IsNumber()
    @Min(0)
    @Max(9)
    column: number;

    @IsString()
    @IsIn(rightOrDown)
    position: "RIGHT" | "DOWN"
}

export class SetupDTO {
    @IsNotEmpty()
    A: Position;

    @IsNotEmpty()
    B: Position;

    @IsNotEmpty()
    C: Position;

    @IsNotEmpty()
    D: Position;

    @IsNotEmpty()
    E: Position;
}