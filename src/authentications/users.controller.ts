import { Body, Controller, Get, Post, Query, Res } from '@nestjs/common';
import { Response } from 'express';
import { UserDTO } from './entities/user-dto';
import { UsersService } from './users.service';

@Controller("/users")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post("/login")
  async login(
    @Body() userDTO: UserDTO,
    @Res({ passthrough: true }) response: Response
  ): Promise<UserDTO> {
    return await this.usersService.login(userDTO, response);
  }

  @Post()
  async createUser(
    @Body() userDTO: UserDTO,
  ): Promise<UserDTO> {
    return await this.usersService.createUser(userDTO);
  }
  
  @Post("/logout")
  async logout(
    @Res({ passthrough: true }) response: Response
  ) {
    //clears SESSION_TOKEN and invalidates session id on ticket server
    await this.usersService.logout(response);
  }
}
