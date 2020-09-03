import { Redirect, Route, RouteProps, useParams } from 'react-router-dom';
import { useLazyQuery } from '@apollo/react-hooks';
import React, { useEffect } from 'react';

import { useAuth } from 'providers/AuthProvider';
import { useCustomer } from 'providers/CustomerProvider';
import getCustomerQuery from 'queries/getEditCustomer';

const CustomerRoute = (props: RouteProps) => {
  const { user } = useAuth();
  const { customerSlug } = useParams();
  const { storageCustomer, setActiveCustomer, setStorageCustomer } = useCustomer();
  const storageSlug = storageCustomer && storageCustomer?.slug;

  const [fetchCustomer] = useLazyQuery(getCustomerQuery, {
    onCompleted: (result: any) => {
      setActiveCustomer(result?.customer);
      setStorageCustomer(result?.customer);
    },
  });

  useEffect(() => {
    if ((customerSlug && storageSlug) && customerSlug !== storageSlug) {
      fetchCustomer({
        variables: {
          customerSlug,
        },
      });
    }
  }, [customerSlug, storageSlug, fetchCustomer]);

  if (!user) return <Redirect to="/login" />;

  return (
    <Route {...props} />
  );
};

export default CustomerRoute;
