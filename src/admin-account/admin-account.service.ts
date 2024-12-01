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
    email: string,
    address: string,
    phoneNumber: string,
    password: string,
  ): Promise<AdminAccount> {
    const hashedPassword = await bcrypt.hash(password, 10);
    const account = this.adminAccountRepository.create({
      username,
      email,
      address,
      phoneNumber,
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

  async getProfileByUsername(username: string): Promise<Partial<AdminAccount>> {
    const account = await this.adminAccountRepository.findOneBy({ username });
    if (!account) {
      throw new Error('Admin account not found');
    }

    // Exclude the password field from the response
    const { password, ...profile } = account;
    return profile;
  }

  async updateProfileImage(
    username: string,
    profileImagePath: string,
  ): Promise<Partial<AdminAccount>> {
    const account = await this.adminAccountRepository.findOneBy({ username });
    if (!account) {
      throw new Error('Admin account not found');
    }

    account.profileImage = profileImagePath;
    await this.adminAccountRepository.save(account);

    const { password, ...updatedProfile } = account;
    return updatedProfile;
  }

  async updateAdminAccount(
    currentUsername: string,
    newUsername: string,
    email: string,
    address: string,
    phoneNumber: string,
  ): Promise<Partial<AdminAccount>> {
    const account = await this.adminAccountRepository.findOneBy({
      username: currentUsername,
    });
    if (!account) {
      throw new Error('Admin account not found');
    }

    // Update the fields
    account.username = newUsername;
    account.email = email;
    account.address = address;
    account.phoneNumber = phoneNumber;

    await this.adminAccountRepository.save(account);

    const { password, ...updatedProfile } = account;
    return updatedProfile;
  }
}
