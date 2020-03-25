import React from "react";
import { withRouter } from "react-router";
const InnerPage = ({ location }) => {
  console.log(location);
  return <div>InnerPage</div>;
};

export default withRouter(InnerPage);
