import React from "react";
import { useLocation } from "react-router";
const InnerPage = () => {
  const location = useLocation();
  console.log(location);
  return <div>InnerPage</div>;
};

export default InnerPage;
