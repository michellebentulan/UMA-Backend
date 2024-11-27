// sessions/session.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Session } from './session.entity';
import { User } from '../users/user.entity';

@Injectable()
export class SessionService {
  constructor(
    @InjectRepository(Session)
    private readonly sessionRepository: Repository<Session>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async validateSession(token: string): Promise<User | null> {
    const session = await this.sessionRepository.findOne({
      where: { session_token: token },
      relations: ['user'],
    });

    if (session && session.expires_at > new Date()) {
      return session.user;
    }
    return null;
  }
}
