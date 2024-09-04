import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthDto } from './dto';
import * as argon2 from 'argon2';
import { User } from '@prisma/client';

@Injectable({})
export class AuthService {
  constructor(private prisma: PrismaService) {}

  login() {
    return { message: "You're now logged in" };
  }

  async signup(dto: AuthDto) {
    type UserInput = Omit<User, 'id' | 'createdAt' | 'updatedAt'>;
    const { username, firstname, lastname, email, password } = dto;
    try {
      const hash = await argon2.hash(dto.password);

      const data: UserInput = {
        username,
        firstname,
        lastname: lastname ? lastname : '',
        email,
        password: hash,
      };

      const user = await this.prisma.user.create({
        data,
      });
      return user;
    } catch (err) {
      throw new Error(err);
    }
  }
}
