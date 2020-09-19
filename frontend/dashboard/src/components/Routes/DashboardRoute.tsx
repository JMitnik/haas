import { Redirect, Route, RouteProps } from 'react-router';
import { useUser } from 'providers/UserProvider';
import React from 'react';

const DashboardRoute = (props: RouteProps) => {
  const { isLoggedIn } = useUser();

  if (!isLoggedIn) return <Redirect to="/public/login" />;

  return (
    <Route {...props} />
  );
};

export default DashboardRoute;
