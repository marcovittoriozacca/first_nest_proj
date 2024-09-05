import * as jwt from 'jsonwebtoken';

interface payload {
  id: string;
  email: string;
}
export const signToken = (
  payload: payload,
  SECRET_KEY: string,
  expiresIn: string | number,
): string => {
  return jwt.sign(payload, SECRET_KEY, { expiresIn: expiresIn });
};
