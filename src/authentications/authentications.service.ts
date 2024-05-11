import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UserDTO } from './entities/user-dto';
import { CurrentMatches } from './entities/current-matches.entity';
import { Response } from 'express';
import { decrypt, encrypt } from 'src/util/encryption.util';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user-table.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AuthenticationsService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}
  
  async login(
    userDTO: UserDTO,
    response: Response
  ): Promise<string> {
    //attaches SESSION_TOKEN cookie open token object with user_id
    //also returns current open matches
    const user = await this.userRepository.findOneBy({user_id: userDTO.userId});

    if (!user) {
      throw new HttpException('This user is not found', HttpStatus.UNAUTHORIZED);
    }
    if (await decrypt(user.password) !== userDTO.password) {
      throw new HttpException('Wrong password', HttpStatus.UNAUTHORIZED);
    } else {
      const encryptedUserId = await encrypt(userDTO.userId)
      response.cookie('SESSION_TOKEN', encryptedUserId)
      
      return "Success"
    }
    
  }

  async createUser(createUserDto: UserDTO): Promise<string> {
    const { userId, password } = createUserDto;
    console.log(createUserDto)
    const newUser = new User();
    newUser.user_id = userId;
    newUser.password = await encrypt(password);
    const createdUser = await this.userRepository.save(newUser);
    return createdUser.user_id;
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
