import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AdminAccount } from './admin-account.entiity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AdminAccountService {
  constructor(
    @InjectRepository(AdminAccount)
    private readonly adminAccountRepository: Repository<AdminAccount>,
  ) {}

  async createAdminAccount(
    username: string,
    password: string,
  ): Promise<AdminAccount> {
    const hashedPassword = await bcrypt.hash(password, 10);
    const account = this.adminAccountRepository.create({
      username,
      password: hashedPassword,
    });
    return await this.adminAccountRepository.save(account);
  }

  async validateAdminAccount(
    username: string,
    password: string,
  ): Promise<boolean> {
    const account = await this.adminAccountRepository.findOneBy({ username });
    if (!account) return false;
    return await bcrypt.compare(password, account.password);
  }
}
