import { Redirect, Route, RouteProps, generatePath, useParams } from 'react-router';
import React from 'react';

import { DashboardParams } from 'hooks/useNavigator';
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
export const BotRoute = ({ allowedPermission, redirectRoute, ...routeProps }: GuardedRouteProps) => {
  const { isLoggedIn } = useUser();
  const { hasPermission } = useAuth();
  const params: { customerSlug: string, dialogueSlug: string } = useParams();

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

/**
 * Guards routes given specific permission `allowedPermission`.
 * - If `redirectRoute` is specified, will reach that route instead (
 *    Note: ensure params that are expected can be found in current route
 *  )
 */
const GuardedRoute = ({ allowedPermission, redirectRoute, ...routeProps }: GuardedRouteProps) => {
  const { isLoggedIn } = useUser();
  const { hasPermission, canAccessDialogue } = useAuth();
  const params = useParams<DashboardParams>();

  if (!isLoggedIn) return <Redirect to="/logged_out" />;

  if (params.dialogueSlug && !canAccessDialogue(params.dialogueSlug) && !redirectRoute) {
    return <Redirect to="/" />;
  }

  if (params.dialogueSlug && !canAccessDialogue(params.dialogueSlug) && redirectRoute) {
    return <Redirect to={generatePath(redirectRoute, params as any)} />;
  }

  if (allowedPermission && !hasPermission(allowedPermission)) {
    if (!redirectRoute) {
      return <Redirect to="unauthorized" />;
    }
    return <Redirect to={generatePath(redirectRoute, params as any)} />;
  }

  return (
    <Route {...routeProps} />
  );
};

export default GuardedRoute;
