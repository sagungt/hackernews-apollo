import express from 'express';
import { createServer } from 'http';
import { WebSocketServer } from 'ws';
import { useServer } from 'graphql-ws/lib/use/ws';
import schema from './schema';
import { context } from './context';

export const app = express();
export const httpServer = createServer(app);

const wsServer = new WebSocketServer({
  server: httpServer,
  path: '/graphql',
});

export const serverCleanup = useServer({
  schema,
  context,
}, wsServer);
