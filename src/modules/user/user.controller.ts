import { Body, Controller, Get, Post, Query, Res } from '@nestjs/common';
import { Response } from 'express';
import { UserDTO } from './entities/dto/user-dto';
import { UserService } from './user.service';
import { LimitQuery } from 'src/entities/limit-query.entity';

@Controller("/users")
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async getUser(
    @Query() limitQuery: LimitQuery
  ): Promise<UserDTO[]> {
    return await this.userService.getUsers(limitQuery.limit);
  }

  @Post()
  async createUser(
    @Body() userDTO: UserDTO,
  ): Promise<UserDTO> {
    return await this.userService.createUser(userDTO);
  }

  @Post("/login")
  async login(
    @Body() userDTO: UserDTO,
    @Res({ passthrough: true }) response: Response
  ): Promise<UserDTO> {
    return await this.userService.login(userDTO, response);
  }
  
  @Post("/logout")
  async logout(
    @Res({ passthrough: true }) response: Response
  ) {
    //clears SESSION_TOKEN and invalidates session id on ticket server
    await this.userService.logout(response);
  }
}
