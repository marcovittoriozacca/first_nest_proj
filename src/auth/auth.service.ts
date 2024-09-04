import { Injectable } from '@nestjs/common';

@Injectable({})
export class AuthService {
  login() {
    return { message: "You're now logged in" };
  }

  signup() {
    return { message: 'You signed up correctly' };
  }
}
