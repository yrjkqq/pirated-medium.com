import { ThemeProvider, theme } from '../styles/styled';
import React from 'react';
import Layout from './Layout';
import GlobalStyle from '../styles/global-styles';

const Root = () => {
  return (
    <ThemeProvider theme={theme.default}>
      <Layout />
      <GlobalStyle />
    </ThemeProvider>
  );
};

export default Root;
