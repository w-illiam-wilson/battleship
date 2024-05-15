// user.repository.ts
import { DataSource, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { User } from '../entities/repository/user.entity';

@Injectable()
export class UserRepository extends Repository<User> {
  constructor(private dataSource: DataSource)
    {
        super(User, dataSource.createEntityManager());
    }
    
  async getUsersWithLimit(
    limit: number
  ): Promise<User[]> {
    const query = this
      .createQueryBuilder('user')
      .select('user.user_id', 'user_id');

    if (limit) {
      query.limit(limit);
    }

    return await query.getRawMany();
  }
}
