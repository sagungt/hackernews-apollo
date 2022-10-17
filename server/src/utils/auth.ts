import * as jwt from 'jsonwebtoken';

export interface AuthTokenPayload {
  userId: number;
}

export function decodeAuthHeader(authHeader: string): AuthTokenPayload {
  const token = authHeader.replace('Bearer ', '');
  if (!token) {
    throw new Error('No token found');
  }

  return jwt.verify(token, process.env.APP_SECRET as string) as AuthTokenPayload;
}
