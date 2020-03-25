// ./routes/index.js
import React from 'react';
import MainPage from "./MainPage";
import AnotherPage from "./AnotherPage";

const routes = [
  {
    path: "/",
    name: "home",
    exact: true,
    children: <MainPage />
  },
  {
    path: "/another",
    name: "another",
    children: <AnotherPage />
  }
];

export default routes;
