import { Body, Controller, Get, Post, Query, Res } from '@nestjs/common';
import { Response } from 'express';
import { PostUserDTO } from '../entities/dto/user-dto';
import { UserService } from '../services/user.service';
import { LimitQuery } from 'src/entities/limit-query.entity';
import { User } from '../entities/repository/user.entity';

@Controller('/users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async getUser(@Query() limitQuery: LimitQuery): Promise<User[]> {
    return await this.userService.getUsers(limitQuery.limit);
  }

  @Post()
  async createUser(@Body() userDTO: PostUserDTO): Promise<User> {
    return await this.userService.createUser(userDTO);
  }

  @Post('/login')
  async login(
    @Body() userDTO: PostUserDTO,
    @Res({ passthrough: true }) response: Response,
  ): Promise<User> {
    return await this.userService.login(userDTO, response);
  }

  @Post('/logout')
  async logout(@Res({ passthrough: true }) response: Response) {
    //clears SESSION_TOKEN and invalidates session id on ticket server
    await this.userService.logout(response);
  }
}
