import { Body, Controller, Get, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto, LoginDto } from './dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  //login - POST - route at /auth/login
  @Post('login')
  async login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  //signup - POST - route at /auth/signup
  @Post('signup')
  async signup(@Body() dto: AuthDto) {
    return this.authService.signup(dto);
  }
}
