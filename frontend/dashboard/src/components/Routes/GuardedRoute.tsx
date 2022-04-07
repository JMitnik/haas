import { Redirect, Route, RouteProps, generatePath, useParams } from 'react-router';
import React from 'react';

import { SystemPermission } from 'types/generated-types';
import { useUser } from 'providers/UserProvider';
import useAuth from 'hooks/useAuth';

interface GuardedRouteProps extends RouteProps {
  allowedPermission?: SystemPermission;
  redirectRoute?: string;
}

/**
 * Guards routes given specific permission `allowedPermission`.
 * - If `redirectRoute` is specified, will reach that route instead (
 *    Note: ensure params that are expected can be found in current route
 *  )
 */
const GuardedRoute = ({ allowedPermission, redirectRoute, ...routeProps }: GuardedRouteProps) => {
  const { isLoggedIn } = useUser();
  const { hasPermission } = useAuth();
  const params = useParams();
  console.log('params: ', params);

  if (!isLoggedIn) return <Redirect to="/logged_out" />;

  if (allowedPermission && !hasPermission(allowedPermission)) {
    if (!redirectRoute) {
      return <Redirect to="unauthorized" />;
    }
    return <Redirect to={generatePath(redirectRoute, params)} />;
  }

  return (
    <Route {...routeProps} />
  );
};

export default GuardedRoute;
