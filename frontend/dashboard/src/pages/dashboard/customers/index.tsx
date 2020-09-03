import { useErrorHandler } from 'react-error-boundary';
import { useQuery } from '@apollo/react-hooks';
import React from 'react';

import { useAuth } from 'providers/AuthProvider';
import CustomerOverview from 'views/CustomerOverview';
import getCustomerQuery from 'queries/getCustomersQuery';

const CustomersPage = () => {
  const { user } = useAuth();
  const { loading, error, data } = useQuery(getCustomerQuery, {
    variables: {
      userId: user?.id,
    },
  });
  useErrorHandler(error);

  const customers = data?.customers;

  return <CustomerOverview isLoading={loading} customers={customers} />;
};

export default CustomersPage;
