import { Body, Controller, Get, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  //login - POST - route at /auth/login
  @Post('login')
  login() {
    return this.authService.login();
  }

  //signup - POST - route at /auth/signup
  @Post('signup')
  async signup(@Body() dto: AuthDto) {
    return this.authService.signup(dto);
  }
}
