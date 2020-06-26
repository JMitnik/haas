import { Div, H2, H4 } from '@haas/ui';
import { getCustomerQuery } from 'queries/getCustomersQuery';
import { useQuery } from '@apollo/react-hooks';
import CustomerOverview from 'views/CustomerOverview';
import React from 'react';

const ErrorCard = () => (
  <Div>
    <H2>Sorry for the inconvenience</H2>
    <H4>We will be right back!</H4>
  </Div>
);

const CustomersPage = () => {
  const { loading, error, data } = useQuery(getCustomerQuery);

  if (error) {
    return (
      <Div>
        Mistake made
      </Div>
    );
  }

  if (loading) return <p>Loading</p>;

  const customers = data?.customers;

  return <CustomerOverview customers={customers} />;
};

export default CustomersPage;
