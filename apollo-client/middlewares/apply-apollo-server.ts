import { gql } from 'apollo-boost';
import { ApolloServer } from 'apollo-server-express';
import type { ServerRegistration } from 'apollo-server-express';
import logger from '../utils/logger';

const books = [
  {
    title: 'Harry Potter and the Chamber of Secrets',
    author: 'J.K. Rowling',
  },
  {
    title: 'Jurassic Park',
    author: 'Michael Crichton',
  },
];

const typeDefs = gql`
  # Comments in GraphQL strings (such as this one) start with the hash (#) symbol.

  # This "Book" type defines the queryable fields for every book in our data source.
  type Book {
    title: String
    author: String
  }

  # The "Query" type is special: it lists all of the available queries that
  # clients can execute, along with the return type for each. In this
  # case, the "books" query returns an array of zero or more Books (defined above).
  type Query {
    books: [Book]
  }
`;

const resolvers = {
  Query: {
    books: () => books,
  },
};

const myPlugin = {
  // Fires whenever a GraphQL request is received from a client.
  requestDidStart(requestContext: any) {
    logger.debug('Request started! Query:\n' + requestContext.request.query);

    return {
      // Fires whenever Apollo Server will parse a GraphQL
      // request to create its associated document AST.
      parsingDidStart() {
        logger.debug('Parsing started!');
      },

      // Fires whenever Apollo Server will validate a
      // request's document AST against your GraphQL schema.
      validationDidStart() {
        logger.debug('Validation started!');
      },
    };
  },
};

const server = new ApolloServer({ typeDefs, resolvers, plugins: [myPlugin] });

export const applyApolloServer = ({ app }: ServerRegistration): string => {
  server.applyMiddleware({ app });
  return server.graphqlPath;
};

// server
//   .listen()
//   .then(({ url }) => {
//     logger.info(`🚀 ApolloServer ready at ${url}`);
//   })
//   .catch((error) => {
//     logger.error(`ApolloServer init failed: ${error}`);
//   });
