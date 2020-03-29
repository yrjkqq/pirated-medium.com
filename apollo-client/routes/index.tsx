// ./routes/index.js
import React from 'react';
import MainPage from './MainPage';
import AnotherPage from './AnotherPage';
import NotFound from './NotFound';
import Other from './Other';
import UploadDogPic from './UploadDogPic';

const routes = [
  {
    path: '/',
    name: 'home',
    exact: true,
    children: <MainPage />,
  },
  {
    path: '/another',
    name: 'another',
    exact: false,
    children: <AnotherPage />,
  },
  {
    path: '/other',
    name: 'other',
    exact: false,
    children: <Other />,
  },
  {
    path: '/upload-dog-pic',
    name: 'uploadDogPic',
    exact: false,
    children: <UploadDogPic />,
  },
  {
    path: '*',
    name: 'notFound',
    children: <NotFound />,
  },
];

const redirectRoutes = [
  {
    status: 301,
    from: '/another',
    to: '/other',
  },
];

export { routes, redirectRoutes };
