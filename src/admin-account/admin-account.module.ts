import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminAccount } from './admin-account.entiity';
import { AdminAccountService } from './admin-account.service';
import { AdminAccountController } from './admin-account.controller';

@Module({
  imports: [TypeOrmModule.forFeature([AdminAccount])],
  controllers: [AdminAccountController],
  providers: [AdminAccountService],
})
export class AdminAccountModule {}
