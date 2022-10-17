import { ApolloServer } from 'apollo-server-express';
import {
  ApolloServerPluginDrainHttpServer,
  // ApolloServerPluginLandingPageGraphQLPlayground,
  ApolloServerPluginLandingPageLocalDefault,
} from 'apollo-server-core';
import schema from './schema';
import { context } from './context';
import { httpServer, serverCleanup, app } from './socket';

const server = new ApolloServer({
  schema,
  context,
  csrfPrevention: true,
  plugins: [
    ApolloServerPluginDrainHttpServer({ httpServer }),
    {
      async serverWillStart() {
        return {
          async drainServer() {
            await serverCleanup.dispose();
          },
        };
      },
    },
    // ApolloServerPluginLandingPageGraphQLPlayground(),
    ApolloServerPluginLandingPageLocalDefault({ embed: true }),
  ],
});

const port = 3000;

async function start() {
  await server.start();
  server.applyMiddleware({ app });
}

start();
httpServer.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`🚀 Server ready at http://localhost:${port}${server.graphqlPath}`);
});

export default server;
