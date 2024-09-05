import { Injectable, Req } from '@nestjs/common';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private config: ConfigService,
    private prisma: PrismaService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: config.get('JWT_SECRET'),
    });
  }
  async validate(payload: any) {
    const id: string = payload.sub;
    try {
      const user = await this.prisma.user.findFirst({
        where: { id },
      });
      const fullname = {
        firstname: user.firstname,
        lastname: user.lastname,
      };

      delete user.password;
      delete user.firstname;
      delete user.lastname;
      delete user.createdAt;
      delete user.updatedAt;

      return { ...user, fullname: fullname };
    } catch (err) {
      throw err;
    }
  }
}
