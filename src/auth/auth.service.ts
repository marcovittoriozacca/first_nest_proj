import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthDto, LoginDto } from './dto';
import * as argon2 from 'argon2';
import { User } from '@prisma/client';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

@Injectable({})
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private config: ConfigService,
    private jwt: JwtService,
  ) {}

  async login(dto: LoginDto) {
    const { email, password } = dto;

    try {
      const user = await this.prisma.user.findFirst({
        where: { email },
      });
      if (!user) throw new ForbiddenException('This email doesnt exist');

      const checkPassword = await argon2.verify(user.password, password);

      if (!checkPassword) throw new ForbiddenException('Password is incorrect');

      const token = this.singToken(user.id, user.email);

      return token;
    } catch (err) {
      if (err instanceof PrismaClientKnownRequestError) {
        throw new ForbiddenException('Server error');
      }
      throw err;
    }
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

      const token = this.singToken(user.id, user.email);

      return token;
    } catch (err) {
      if (err instanceof PrismaClientKnownRequestError) {
        if (err.code === 'P2002')
          throw new ForbiddenException('credentials already taken');
      }
      throw err;
    }
  }

  async singToken(
    id: string | number,
    email: string,
  ): Promise<{ access_token: string }> {
    const payload = { sub: id, email };

    const token = await this.jwt.signAsync(payload, {
      expiresIn: '1h',
      secret: this.config.get('JWT_SECRET'),
    });
    return { access_token: token };
  }
}
