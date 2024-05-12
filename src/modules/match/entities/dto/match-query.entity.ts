import { Transform } from "class-transformer";
import { IsBoolean, IsOptional, IsString } from "class-validator";
import { LimitQuery } from "src/entities/limit-query.entity";

export class MatchQuery extends LimitQuery {
    @IsOptional()
    @IsString()
    userId?: string;

    @IsOptional()
    @IsBoolean()
    @Transform(({obj, key}) => {
        if (obj[key] === "true") {
            return true;
        } else if (obj[key] === "false") {
            return false;
        } else {
            return undefined;
        }
      })
    finished?: boolean
}