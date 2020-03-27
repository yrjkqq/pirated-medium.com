import React from 'react';
import { useLocation } from 'react-router';
import logger from '../utils/logger';
const MainPage = () => {
  const location = useLocation();
  logger.debug(location);
  return <div>mainPage</div>;
};

export default MainPage;
