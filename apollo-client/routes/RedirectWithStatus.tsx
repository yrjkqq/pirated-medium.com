import React from 'react';
import { Redirect, Route } from 'react-router';
import type * as R from 'react-router';

export interface RedirectProps extends R.RedirectProps {
  status: number;
}

const RedirectWithStatus = ({ from, to, status }: RedirectProps) => {
  return (
    <Route
      render={({ staticContext }) => {
        if (staticContext) {
          staticContext.statusCode = status;
        }
        return <Redirect from={from} to={to} />;
      }}
    />
  );
};

export default RedirectWithStatus;
