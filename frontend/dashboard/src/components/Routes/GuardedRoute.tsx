import { Redirect, Route, RouteProps } from 'react-router';
import { SystemPermission } from 'types/globalTypes';
import { useUser } from 'providers/UserProvider';
import React from 'react';
import useAuth from 'hooks/useAuth';

interface GuardedRouteProps extends RouteProps {
  allowedPermission?: SystemPermission;
}

const GuardedRoute = ({ allowedPermission, ...routeProps }: GuardedRouteProps) => {
  const { isLoggedIn } = useUser();
  const { hasPermission } = useAuth();

  if (!isLoggedIn) return <Redirect to="/public/login" />;

  if (allowedPermission && !hasPermission(allowedPermission)) {
    return <Redirect to="/unauthorized" />;
  }

  return (
    <Route {...routeProps} />
  );
};

export default GuardedRoute;
