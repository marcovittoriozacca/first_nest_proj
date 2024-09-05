import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient {
  constructor(confing: ConfigService) {
    super({
      datasources: {
        db: {
          url: confing.get('DATABASE_URL'),
        },
      },
    });
  }
}
