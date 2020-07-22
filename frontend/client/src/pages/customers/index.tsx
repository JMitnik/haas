import { ErrorBoundary, useErrorHandler } from 'react-error-boundary';
import { useQuery } from '@apollo/react-hooks';
import React from 'react';

import { getCustomerQuery } from 'queries/getCustomerQuery';
import CustomerOverview from 'views/CustomerOverview/CustomerOverview';
import Loader from 'components/Loader';

const CustomersPage = () => {
  const { data, loading, error } = useQuery(getCustomerQuery);
  const customers = data?.customers;
  useErrorHandler(error);

  if (loading) return <Loader />;

  return <CustomerOverview customers={customers} />;
};

export default CustomersPage;
