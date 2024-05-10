import { Injectable } from '@nestjs/common';
import { Login } from './entities/login.entity';
import { CurrentMatches } from './entities/current-matches.entity';
import { Response } from 'express';
import { decrypt, encrypt } from 'src/util/encryption.util';

@Injectable()
export class AuthenticationsService {
  async login(
    login: Login,
    response: Response
  ): Promise<CurrentMatches> {
    //attaches SESSION_TOKEN cookie open token object with user_id
    //also returns current open matches
    const encryptedUserId = await encrypt(login.userId)
    response.cookie('SESSION_TOKEN', encryptedUserId)
    
    return {"currentMatches": []}
  }

  async logout(
    response: Response
  ) {
    //it should also send this session to a ticket server to invalidate
    response.cookie('SESSION_TOKEN', "", {
      maxAge: 0
    })
    
    return {"currentMatches": []}
  }
}
