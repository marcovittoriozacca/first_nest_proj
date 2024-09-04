import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable({})
export class AuthService {
  constructor(private prismaService: PrismaService) {}

  login() {
    return { message: "You're now logged in" };
  }

  signup(dto: any) {
    return { message: 'You signed up correctly' };
  }
}
