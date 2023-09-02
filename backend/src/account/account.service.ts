import { PrismaService } from 'nestjs-prisma';
import { Injectable } from '@nestjs/common';

@Injectable()
@Injectable()
export class AccountService {
  constructor(private prisma: PrismaService) {}
}
