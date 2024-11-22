import { Controller, Post, Body } from '@nestjs/common';
import { AdminAccountService } from './admin-account.service';

@Controller('admin-accounts')
export class AdminAccountController {
  constructor(private readonly adminAccountService: AdminAccountService) {}

  @Post('register')
  async createAdminAccount(
    @Body('username') username: string,
    @Body('password') password: string,
  ) {
    return this.adminAccountService.createAdminAccount(username, password);
  }

  @Post('login')
  async loginAdminAccount(
    @Body('username') username: string,
    @Body('password') password: string,
  ) {
    const isValid = await this.adminAccountService.validateAdminAccount(
      username,
      password,
    );
    if (isValid) return { message: 'Login successful' };
    throw new Error('Invalid credentials');
  }
}
