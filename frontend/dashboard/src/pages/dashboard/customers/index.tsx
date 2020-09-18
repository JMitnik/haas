import { useErrorHandler } from 'react-error-boundary';
import { useQuery } from '@apollo/react-hooks';
import React from 'react';

import { useUser } from 'providers/UserProvider';
import CustomerOverview from 'views/CustomerOverview';
import getCustomersQuery from 'queries/getCustomersQuery';

const CustomersPage = () => {
  const { user } = useUser();

  const { loading, error, data } = useQuery(getCustomersQuery, {
    variables: {
      userId: user?.id,
    },
  });
  useErrorHandler(error);

  const customers = data?.user?.customers || [];

  return <CustomerOverview isLoading={loading} customers={customers} />;
};

export default CustomersPage;
