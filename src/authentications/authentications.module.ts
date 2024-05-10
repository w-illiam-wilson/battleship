import { Module } from '@nestjs/common';
import { AuthenticationsController } from './login.controller';
import { AuthenticationsService } from './login.service';

@Module({
  controllers: [AuthenticationsController],
  providers: [AuthenticationsService],
})
export class AuthenticationsModule { }
