import { IsString } from "class-validator";

export class Login {
    @IsString()
    userId: string;

    @IsString()
    password: string;
}