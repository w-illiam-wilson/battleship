import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PostUserDTO } from '../entities/dto/user-dto';
import { Response } from 'express';
import { decrypt, encrypt } from 'src/modules/user/util/encryption.util';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../entities/repository/user.entity';
import { Repository } from 'typeorm';
import { UserRepository } from '../repositories/user.repository';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async getUsers(limit: number): Promise<User[]> {
    return await this.userRepository.getUsersWithLimit(limit);
  }

  async createUser(createUserDTO: PostUserDTO): Promise<User> {
    const encryption = await encrypt(createUserDTO.password);

    const newUser = new User();
    newUser.user_id = createUserDTO.user_id;
    newUser.salt = encryption.salt;
    newUser.password = encryption.encryptedText;

    const existingUser = await this.userRepository.findOneBy({
      user_id: newUser.user_id,
    });
    if (existingUser) {
      throw new HttpException('User already exists', HttpStatus.CONFLICT);
    }

    return await this.userRepository.save(newUser);
  }

  async login(userDTO: PostUserDTO, response: Response): Promise<User> {
    const user = await this.userRepository.findOneBy({
      user_id: userDTO.user_id,
    });

    if (
      !user ||
      (await decrypt({ encryptedText: user.password, salt: user.salt })) !==
        userDTO.password
    ) {
      throw new HttpException('Wrong credentials', HttpStatus.UNAUTHORIZED);
    }

    const encryptedUserId = await encrypt(userDTO.user_id);
    response.cookie('SESSION_TOKEN', encryptedUserId);

    return user;
  }

  async logout(response: Response) {
    //it should also send this session to a ticket server to invalidate
    response.cookie('SESSION_TOKEN', '', {
      maxAge: 0,
    });
  }
}
