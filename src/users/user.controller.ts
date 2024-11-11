import {
  Controller,
  Post,
  Body,
  Get,
  Put,
  Param,
  Delete,
  UploadedFile,
  UseInterceptors,
  BadRequestException,
} from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './user.entity';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  // Step 1: Create Account
  // @Post('create-account')
  // async createAccount(@Body() userData: Partial<User>) {
  //   console.log('Creating user account:', userData);
  //   return this.userService.createAccount(userData);
  // }
  @Post('create-account')
  async createAccount(@Body() userData: Partial<User>) {
    console.log('Creating user account:', userData);
    const { user, sessionToken } =
      await this.userService.createAccount(userData);
    console.log('Created user:', user);
    return { user, sessionToken };
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

  @Get(':id')
  async getUserProfile(@Param('id') id: number) {
    return this.userService.getUserProfile(id);
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

  @Post('upload-profile-image/:id')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads/profile-images',
        filename: (req, file, callback) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          callback(null, `profile-${uniqueSuffix}${ext}`);
        },
      }),
      fileFilter: (req, file, callback) => {
        if (!file.mimetype.match(/\/(jpg|jpeg|png)$/)) {
          return callback(
            new BadRequestException('Only image files are allowed!'),
            false,
          );
        }
        callback(null, true);
      },
    }),
  )
  async uploadProfileImage(
    @Param('id') userId: number,
    @UploadedFile() file: any,
  ) {
    if (!file) {
      throw new BadRequestException('File is required');
    }
    console.log('Uploaded file:', file);
    return this.userService.updateProfileImage(userId, file.filename);
  }

  @Delete('delete-expired-sessions')
  async deleteExpiredSessions() {
    await this.userService.deleteExpiredSessions();
    return { message: 'Expired sessions deleted successfully' };
  }

  @Put('expire-session')
  async expireSessionInTwoMinutes(@Body('sessionToken') sessionToken: string) {
    await this.userService.expireSessionInTwoMinutes(sessionToken);
    return { message: 'Session will expire in 2 minutes' };
  }
}
