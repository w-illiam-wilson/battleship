import { IsInt, IsNotEmpty, Max, Min } from 'class-validator';

export class MissileDTO {
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
}
