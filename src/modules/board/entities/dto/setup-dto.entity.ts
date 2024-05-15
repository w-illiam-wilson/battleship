import { Type } from 'class-transformer';
import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsEnum,
  IsInt,
  IsNotEmpty,
  Max,
  Min,
  ValidateNested,
} from 'class-validator';

export enum Heading {
  RIGHT = 'RIGHT',
  DOWN = 'DOWN',
}

export enum ShipName {
  A = "A",
  B = "B",
  C = "C",
  D = "D",
  E = "E"
}

export class ShipPositionDTO {
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

  @IsNotEmpty()
  @IsEnum(ShipName)
  ship: ShipName
}

export class SetupDTO {
  @IsArray()
  @ValidateNested({ each: true })
  @ArrayMinSize(5)
  @ArrayMaxSize(5)
  @Type(() => ShipPositionDTO)
  ships: ShipPositionDTO[];
}
