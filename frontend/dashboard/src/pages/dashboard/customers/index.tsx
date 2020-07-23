import { useErrorHandler } from 'react-error-boundary';
import { useQuery } from '@apollo/react-hooks';
import React from 'react';

import { getCustomerQuery } from 'queries/getCustomersQuery';
import CustomerOverview from 'views/CustomerOverview';

const CustomersPage = () => {
  const { loading, error, data } = useQuery(getCustomerQuery);
  useErrorHandler(error);

  if (loading) return <p>Loading</p>;

  const customers = data?.customers;

  return <CustomerOverview customers={customers} />;
};

export default CustomersPage;
