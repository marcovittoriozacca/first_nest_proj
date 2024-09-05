import * as jwt from 'jsonwebtoken';
import 'dotenv/config';

interface payload {
  id: string;
  email: string;
}
export const signToken = (
  payload: payload,
  expiresIn: string | number,
): string => {
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: expiresIn });
};
