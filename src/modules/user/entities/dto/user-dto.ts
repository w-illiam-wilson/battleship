import { IsNotEmpty, IsString } from "class-validator";

export class UserDTO {
    @IsString()
    @IsNotEmpty()
    user_id: string;

    @IsString()
    @IsNotEmpty()
    password: string;
}