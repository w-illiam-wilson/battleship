import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PostUserDTO } from './entities/dto/user-dto';
import { Response } from 'express';
import { decrypt, encrypt } from 'src/modules/user/util/encryption.util';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/database/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) { }

  async getUsers(limit: number): Promise<User[]> {
    const query = this.userRepository.createQueryBuilder('user')
      .select('user.user_id', 'user_id')
    if (limit) {
      query.limit(limit)
    }

    return await query.getRawMany()
  }

  async createUser(createUserDto: PostUserDTO): Promise<User> {
    const newUser = new User();
    const encryption = await encrypt(createUserDto.password);
    newUser.user_id = createUserDto.user_id;
    newUser.salt = encryption.salt;
    newUser.password = encryption.encryptedText;

    console.log(newUser)

    const existingUser = await this.userRepository.findOneBy({ user_id: newUser.user_id });
    if (existingUser) {
      throw new HttpException("User already exists", HttpStatus.CONFLICT)
    }

    return await this.userRepository.save(newUser);
  }

  async login(
    userDTO: PostUserDTO,
    response: Response
  ): Promise<User> {
    const user = await this.userRepository.findOneBy({ user_id: userDTO.user_id });

    if (!user || await decrypt({encryptedText: user.password, salt: user.salt}) !== userDTO.password) {
      throw new HttpException('Wrong credentials', HttpStatus.UNAUTHORIZED);
    }
    else {
      const encryptedUserId = await encrypt(userDTO.user_id)
      response.cookie('SESSION_TOKEN', encryptedUserId)

      delete user.password;
      delete user.salt;
      return user;
    }

  }

  async logout(
    response: Response
  ) {
    //it should also send this session to a ticket server to invalidate
    response.cookie('SESSION_TOKEN', "", {
      maxAge: 0
    })
  }
}
