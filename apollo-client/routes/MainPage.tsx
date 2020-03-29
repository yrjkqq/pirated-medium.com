import { useQuery } from '@apollo/react-hooks';
import { gql } from 'apollo-boost';
import React from 'react';
import { bLog } from '../utils/b-log';

interface Book {
  title: string;
  author: string;
}

interface Data {
  books: Book[];
}

const EXCHANGE_RATES = gql`
  # Write your query or mutation here
  {
    books {
      title
      author
    }
  }
`;
const MainPage = () => {
  const { loading, error, data, refetch } = useQuery<Data>(EXCHANGE_RATES, {
    ssr: false,
  });
  if (loading) {
    return <p>Loading...</p>;
  }
  if (error) {
    return <p>Error: {error}</p>;
  }
  return (
    <div>
      <button
        style={{ padding: '10px' }}
        onClick={() => {
          bLog.info(new Error());
          refetch();
        }}
      >
        refetch
      </button>
      {data &&
        data.books.map(({ author, title }, index) => (
          <div key={index}>
            <p>
              {author}: {title}
            </p>
          </div>
        ))}
    </div>
  );
};

export default MainPage;
