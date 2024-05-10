import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthenticationsService {
  getLeaderboard(limit?: number): string {
    return 'Hello World!';
  }

  getHistory(userId: string, limit?: number): string {
    return 'Hello World!';
  }
}
