import { Transform } from "class-transformer";
import { IsBoolean, IsOptional, IsString } from "class-validator";

export class MatchQuery {
    @IsOptional()
    @IsString()
    userId?: string;

    @IsOptional()
    @Transform(({obj, key}) => {
        return obj[key] === 'true' ? true : obj[key] === 'false' ? false : obj[key];
      })
      @IsBoolean()
    current?: boolean;

    @IsOptional()
    @IsString()
    limit?: number;
}