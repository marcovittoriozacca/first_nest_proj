import { Controller, Get, Req, UseGuards } from '@nestjs/common';

import { Request } from 'express';
import { UserService } from './user.service';
import { JwtGuard } from 'src/auth/guard';
import { GetUser } from 'src/auth/decorator';
import { User } from '@prisma/client';

@Controller('users')
export class UserController {
  constructor(private userServices: UserService) {}

  @UseGuards(JwtGuard)
  @Get('me')
  async getMe(@GetUser() user: User) {
    return this.userServices.getMe(user);
  }
}
