import logger from '../../utils/logger';

const apiUrl = process.env.API_URL as string;

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

const users = [
  {
    id: '1',
    name: 'Elizabeth Bennet',
  },
  {
    id: '2',
    name: 'Fitzwilliam Darcy',
  },
];

export interface IContext {
  authCode: string;
}

export interface IGetUserVars {
  id: string;
}

const resolvers = {
  Query: {
    books: () => books,
    numberSix() {
      return 6;
    },
    numberSeven() {
      return 7;
    },
    getUser(parent: any, args: IGetUserVars, { authCode }: IContext) {
      logger.debug(authCode);
      return users.find((user) => user.id === args.id);
    },
  },
};

export default resolvers;
