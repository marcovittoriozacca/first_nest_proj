import { Controller, Get, Req, UseGuards } from '@nestjs/common';

import { Request } from 'express';
import { UserService } from './user.service';
import { JwtGuard } from 'src/auth/guard';

@Controller('users')
export class UserController {
  constructor(private userServices: UserService) {}

  @UseGuards(JwtGuard)
  @Get('me')
  async getMe(@Req() req: Request) {
    return this.userServices.getMe(req.user);
  }
}
