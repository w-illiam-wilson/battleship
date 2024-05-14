import {
  HttpException,
  HttpStatus,
  Injectable,
  NestMiddleware,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { ClsService } from 'nestjs-cls';
import { decrypt } from 'src/modules/user/util/encryption.util';

@Injectable()
export class SessionMiddleware implements NestMiddleware {
  constructor(private readonly clsService: ClsService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    if (!req.cookies['SESSION_TOKEN']) {
      throw new HttpException('You must be logged in', HttpStatus.UNAUTHORIZED);
    }

    this.clsService.set('userId', await decrypt(req.cookies['SESSION_TOKEN']));

    next();
  }
}
