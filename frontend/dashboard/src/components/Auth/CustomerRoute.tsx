import { Redirect, Route, RouteProps, useParams } from 'react-router-dom';
import { useLazyQuery } from '@apollo/react-hooks';
import React, { useEffect } from 'react';

import { useAuth } from 'providers/AuthProvider';

const CustomerRoute = (props: RouteProps) => {
  const { user } = useAuth();
  const { customerSlug } = useParams<{ customerSlug: string }>();

  if (!user.id) return <Redirect to="/" />;

  const customer = user?.userCustomers.find((userCustomer: any) => userCustomer.customer.slug === customerSlug);

  if (customer) {
    return (
      <Route {...props} />
    );
  }

  return <Redirect to="/unauthorized" />;
};

export default CustomerRoute;
