import { Injectable } from '@nestjs/common';
import { UserObject } from './interfaces/user.interface';

@Injectable({})
export class UserService {
  getMe(payload: any): UserObject {
    return payload;
  }
}
