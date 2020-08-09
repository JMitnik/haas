import { useErrorHandler } from 'react-error-boundary';
import { useQuery } from '@apollo/react-hooks';
import React from 'react';

import CustomerOverview from 'views/CustomerOverview';
import getCustomerQuery from 'queries/getCustomersQuery';

const CustomersPage = () => {
  const { loading, error, data } = useQuery(getCustomerQuery);
  useErrorHandler(error);

  const customers = data?.customers;

  return <CustomerOverview isLoading={loading} customers={customers} />;
};

export default CustomersPage;
