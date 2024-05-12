import { IsNotEmpty, IsString } from "class-validator";

export class PostUserDTO {
    @IsString()
    @IsNotEmpty()
    user_id: string;

    @IsString()
    @IsNotEmpty()
    password: string;
}