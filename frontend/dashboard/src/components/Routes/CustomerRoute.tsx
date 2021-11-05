import { Redirect, Route, RouteProps, useParams } from 'react-router-dom';
import React from 'react';

import { useUser } from 'providers/UserProvider';

const CustomerRoute = (props: RouteProps) => {
  const { user, isLoggedIn } = useUser();
  const { customerSlug } = useParams<{ customerSlug: string }>();

  const userOfWorkspace = user?.userCustomers.find((c) => c.customer.slug === customerSlug);

  if (!isLoggedIn || !userOfWorkspace?.isActive) return <Redirect to="/" />;

  const customer = user?.userCustomers.find((userCustomer: any) => userCustomer.customer.slug === customerSlug);

  if (customer) {
    return (
      <Route {...props} />
    );
  }

  return <Redirect to="/unauthorized" />;
};

export default CustomerRoute;
