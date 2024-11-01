import {
  Controller,
  Post,
  Body,
  Get,
  Put,
  Param,
  Delete,
} from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './user.entity';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  // Step 1: Create Account
  @Post('create-account')
  async createAccount(@Body() userData: Partial<User>) {
    console.log('Creating user account:', userData);
    return this.userService.createAccount(userData);
  }

  // Step 2: Complete Profile
  @Put('complete-profile/:id')
  async completeProfile(
    @Param('id') id: number,
    @Body() profileData: Partial<User>,
  ) {
    console.log('Completing user profile for ID:', id);
    return this.userService.completeProfile(id, profileData);
  }

  @Post('login')
  async login(
    @Body('phone_number') phoneNumber: string,
    @Body('password') password: string,
  ) {
    return this.userService.login(phoneNumber, password);
  }

  @Get()
  async getAllUsers() {
    return this.userService.getAllUsers(); // Call the service method to fetch users
  }

  // Logout endpoint
  @Delete('logout/:id')
  async logout(@Param('id') userId: number) {
    console.log('Logging out user with ID:', userId);
    await this.userService.logout(userId);
    return { message: 'Logout successful' }; // Confirm successful logout
  }
}
