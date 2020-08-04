import { useErrorHandler } from 'react-error-boundary';
import { useQuery } from '@apollo/react-hooks';
import React from 'react';

import CustomerOverview from 'views/CustomerOverview/CustomerOverview';
import Loader from 'components/Loader';
import getCustomerQuery from 'queries/getCustomerQuery';

const CustomersPage = () => {
  const { data, loading, error } = useQuery(getCustomerQuery);
  const customers = data?.customers;
  useErrorHandler(error);

  if (loading) return <Loader />;

  return <CustomerOverview customers={customers} isLoading />;
};

export default CustomersPage;
