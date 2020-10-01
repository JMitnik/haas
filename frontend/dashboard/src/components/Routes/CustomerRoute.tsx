import { Redirect, Route, RouteProps, useParams } from 'react-router-dom';
import React from 'react';

import { useUser } from 'providers/UserProvider';

const CustomerRoute = (props: RouteProps) => {
  const { user, isLoggedIn } = useUser();
  const { customerSlug } = useParams<{ customerSlug: string }>();

  if (!isLoggedIn) return <Redirect to="/" />;

  const customer = user?.userCustomers.find((userCustomer: any) => userCustomer.customer.slug === customerSlug);

  if (customer) {
    return (
      <Route {...props} />
    );
  }

  return <Redirect to="/unauthorized" />;
};

export default CustomerRoute;
