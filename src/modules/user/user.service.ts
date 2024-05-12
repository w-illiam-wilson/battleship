import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UserDTO } from './entities/dto/user-dto';
import { Response } from 'express';
import { decrypt, encrypt } from 'src/modules/user/util/encryption.util';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/database/user-table.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) { }

  async getUsers(limit: number): Promise<UserDTO[]> {
    const query = this.userRepository.createQueryBuilder('user')
      .select('user.user_id', 'user_id')
    if (limit) {
      query.limit(limit)
    }

    return await query.getRawMany()
  }

  async createUser(createUserDto: UserDTO): Promise<UserDTO> {
    const newUser = new User();
    newUser.user_id = createUserDto.user_id;
    newUser.password = await encrypt(createUserDto.password);

    const existingUser = await this.userRepository.findOneBy({ user_id: newUser.user_id });
    if (existingUser) {
      throw new HttpException("User already exists", HttpStatus.CONFLICT)
    }

    const createdUser = await this.userRepository.save(newUser);
    delete createdUser.password;
    return createdUser;
  }

  async login(
    userDTO: UserDTO,
    response: Response
  ): Promise<UserDTO> {
    const user = await this.userRepository.findOneBy({ user_id: userDTO.user_id });

    if (!user || await decrypt(user.password) !== userDTO.password) {
      throw new HttpException('Wrong credentials', HttpStatus.UNAUTHORIZED);
    }
    else {
      const encryptedUserId = await encrypt(userDTO.user_id)
      response.cookie('SESSION_TOKEN', encryptedUserId)

      delete user.password;
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