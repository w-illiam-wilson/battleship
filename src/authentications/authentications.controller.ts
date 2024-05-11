import { Body, Controller, Get, Post, Query, Res } from '@nestjs/common';
import { Response } from 'express';
import { UserDTO } from './entities/user-dto';
import { AuthenticationsService } from './authentications.service';

@Controller("/authentications")
export class AuthenticationsController {
  constructor(private readonly authenticationsService: AuthenticationsService) {}

  @Post("/login")
  async login(
    @Body() userDTO: UserDTO,
    @Res({ passthrough: true }) response: Response
  ): Promise<string> {
    return await this.authenticationsService.login(userDTO, response);
  }

  @Post("/create")
  async createUser(
    @Body() userDTO: UserDTO,
  ): Promise<string> {
    return await this.authenticationsService.createUser(userDTO);
  }
  
  @Post("/logout")
  async logout(
    @Res({ passthrough: true }) response: Response
  ) {
    //clears SESSION_TOKEN and invalidates session id on ticket server
    await this.authenticationsService.logout(response);
  }
}
