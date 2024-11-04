import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { UserService } from 'src/users/user.service';

@Injectable()
export class SessionCleanupService {
  constructor(private readonly userService: UserService) {}

  @Cron('0 */2 * * *') // Runs every 2 hours
  async handleSessionCleanup() {
    await this.userService.deleteExpiredSessions();
  }
}
