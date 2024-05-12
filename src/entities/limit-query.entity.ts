import { IsNumber, IsOptional, IsPositive } from "class-validator";

export class LimitQuery {
    @IsOptional()
    @IsNumber()
    @IsPositive()
    limit?: number
}