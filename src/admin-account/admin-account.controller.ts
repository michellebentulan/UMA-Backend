import {
  Controller,
  Post,
  Body,
  Get,
  Query,
  UploadedFile,
  UseInterceptors,
  Put,
} from '@nestjs/common';
import { AdminAccountService } from './admin-account.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

@Controller('admin-accounts')
export class AdminAccountController {
  constructor(private readonly adminAccountService: AdminAccountService) {}

  @Post('register')
  async createAdminAccount(
    @Body('username') username: string,
    @Body('email') email: string,
    @Body('address') address: string,
    @Body('phoneNumber') phoneNumber: string,
    @Body('password') password: string,
  ) {
    return this.adminAccountService.createAdminAccount(
      username,
      email,
      address,
      phoneNumber,
      password,
    );
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

  @Get('profile')
  async getAdminProfile(@Query('username') username: string) {
    return await this.adminAccountService.getProfileByUsername(username);
  }

  @Post('upload-profile-image')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads/admin-profile-images',
        filename: (req, file, callback) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          callback(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
        },
      }),
    }),
  )
  async uploadProfileImage(
    @Query('username') username: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) {
      throw new Error('No file uploaded');
    }
    return this.adminAccountService.updateProfileImage(username, file.path);
  }

  @Put('update')
  async updateAdminAccount(
    @Body('username') username: string,
    @Body('newUsername') newUsername?: string,
    @Body('email') email?: string,
    @Body('address') address?: string,
    @Body('phoneNumber') phoneNumber?: string,
  ) {
    return await this.adminAccountService.updateAdminAccount(
      username,
      newUsername,
      email,
      address,
      phoneNumber,
    );
  }
}
