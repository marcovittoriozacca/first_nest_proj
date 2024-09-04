import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthDto, LoginDto } from './dto';
import * as argon2 from 'argon2';
import { User } from '@prisma/client';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import * as jwt from 'jsonwebtoken';
import 'dotenv/config';

@Injectable({})
export class AuthService {
  constructor(private prisma: PrismaService) {}

  async login(dto: LoginDto) {
    const { email, password } = dto;

    const user = await this.prisma.user.findFirst({
      where: { email },
    });
    if (!user) throw new ForbiddenException('This email doesnt exist');

    const checkPassword = await argon2.verify(user.password, password);

    if (!checkPassword) throw new ForbiddenException('Password is incorrect');

    const payload = { id: user.id, email: user.email };

    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: '1d',
    });
    return { ...user, jwtToken: { token } };
  }

  async signup(dto: AuthDto) {
    type UserInput = Omit<User, 'id' | 'createdAt' | 'updatedAt'>;
    const { username, firstname, lastname, email, password } = dto;
    try {
      const hash = await argon2.hash(password);

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
      if (err instanceof PrismaClientKnownRequestError) {
        if (err.code === 'P2002')
          throw new ForbiddenException('credentials already taken');
      }
      throw err;
    }
  }
}
