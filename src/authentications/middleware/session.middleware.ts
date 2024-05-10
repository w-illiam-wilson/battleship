import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { ClsService } from 'nestjs-cls';

@Injectable()
export class SessionMiddleware implements NestMiddleware {
  constructor(private readonly clsService: ClsService) {}

  use(req: Request, res: Response, next: NextFunction) {
    this.clsService.set("userId", "wwilson19")
    console.log('Request...');
    next();
  }
}