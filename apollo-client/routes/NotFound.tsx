import { Route } from 'react-router';
import React from 'react';

const Status = ({
  code,
  children,
}: {
  code: number;
  children: React.ReactNode;
}) => {
  return (
    <Route
      render={({ staticContext }) => {
        if (staticContext) {
          staticContext.statusCode = code;
        }
        return children;
      }}
    />
  );
};

const NotFound = () => {
  return (
    <Status code={404}>
      <div>
        <h1>Sorry, can’t find that.</h1>
      </div>
    </Status>
  );
};

export default NotFound;
