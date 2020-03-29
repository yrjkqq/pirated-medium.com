import { ApolloServer } from 'apollo-server-express';
import type { ServerRegistration } from 'apollo-server-express';
import logger from '../utils/logger';
import resolvers, { IContext } from './apollo-server/resolvers';
import typeDefs from './apollo-server/type-defs';

const myPlugin = {
  // Fires whenever a GraphQL request is received from a client.
  requestDidStart(requestContext: any) {
    // logger.debug('Request started! Query:\n' + requestContext.request.query);

    return {
      // Fires whenever Apollo Server will parse a GraphQL
      // request to create its associated document AST.
      parsingDidStart() {
        // logger.debug('Parsing started!');
      },

      // Fires whenever Apollo Server will validate a
      // request's document AST against your GraphQL schema.
      validationDidStart() {
        // logger.debug('Validation started!');
      },
    };
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
  plugins: [myPlugin],
  context: ({ req, res }): IContext => {
    return {
      authCode: req.headers['user-agent'] as string,
    };
  },
  rootValue: 'root',
});

export const applyApolloServer = ({ app }: ServerRegistration): string => {
  server.applyMiddleware({ app });
  return server.graphqlPath;
};
