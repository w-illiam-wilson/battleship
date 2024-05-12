import { Type } from "class-transformer";
import { IsDefined, IsEnum, IsInt, IsNotEmpty, IsNotEmptyObject, IsObject, Max, Min, ValidateNested} from "class-validator";

enum Heading {
    RIGHT = 'RIGHT',
    DOWN = 'DOWN',
}

export class PositionDTO {
    //this is the left most and upper most position of the boat
    @IsInt()
    @IsNotEmpty()
    @Min(0)
    @Max(9)
    row: number;

    @IsInt()
    @IsNotEmpty()
    @Min(0)
    @Max(9)
    column: number;

    @IsNotEmpty()
    @IsEnum(Heading)
    position: Heading;
}

export class SetupDTO {
    @IsDefined()
    @IsNotEmptyObject()
    @IsObject()
    @ValidateNested()
    @Type(() => PositionDTO)
    A: PositionDTO;

    @IsDefined()
    @IsNotEmptyObject()
    @IsObject()
    @ValidateNested()
    @Type(() => PositionDTO)
    B: PositionDTO;

    @IsDefined()
    @IsNotEmptyObject()
    @IsObject()
    @ValidateNested()
    @Type(() => PositionDTO)
    C: PositionDTO;

    @IsDefined()
    @IsNotEmptyObject()
    @IsObject()
    @ValidateNested()
    @Type(() => PositionDTO)
    D: PositionDTO;

    @IsDefined()
    @IsNotEmptyObject()
    @IsObject()
    @ValidateNested()
    @Type(() => PositionDTO)
    E: PositionDTO;
}