import { Module } from '@nestjs/common';
import { UsersModule } from '../users/users.module';
import { UsersService } from '../users/users.service';
import { AccountController } from './account.controller';
import { EmailModule } from '../email/email.module';
import { EmailService } from '../email/email.service';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [UsersModule, AuthModule, EmailModule],
  controllers: [AccountController],

  providers: [UsersService, EmailService],
})
export class AccountModule {}
