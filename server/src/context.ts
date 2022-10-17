import { PrismaClient } from '@prisma/client';
import { Request } from 'express';
import { PubSub } from 'graphql-subscriptions';
// import { RedisPubSub } from 'graphql-redis-subscriptions';
// import Redis from 'ioredis';
import { decodeAuthHeader } from './utils/auth';

export const prisma = new PrismaClient();
export const pubsub = new PubSub();

// const options = {
//   host: '172.31.99.167',
//   port: 6379,
//   username: 'default',
//   password: 'jaringan',
//   retryStrategy: (times: number) => Math.min(times * 50, 2000),
// };

// export const pubsub = new RedisPubSub({
//   connection: options,
// });

export interface Context {
  prisma: PrismaClient;
  userId?: number;
  pubsub: PubSub;
}

export const context = ({ req }: { req: Request }): Context => {
  const token = req && req.headers.authorization
    ? decodeAuthHeader(req.headers.authorization)
    : null;

  return {
    prisma,
    userId: token?.userId,
    pubsub,
  };
};
