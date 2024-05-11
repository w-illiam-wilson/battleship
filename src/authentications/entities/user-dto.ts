import { IsString } from "class-validator";

export class UserDTO {
    @IsString()
    userId: string;

    @IsString()
    password: string;
}