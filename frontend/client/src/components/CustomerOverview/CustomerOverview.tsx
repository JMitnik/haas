import React from 'react';
import { useQuery } from '@apollo/react-hooks';

import { H1, Div, Grid } from '@haas/ui';
import { getCustomerQuery } from 'queries/getCustomerQuery';
import Logo from 'components/Logo';
import { CustomerOverviewContainer } from 'components/CustomerOverview/CustomerOverviewStyles';
import CustomerCard from 'components/CustomerCard/CustomerCard';
import Loader from 'components/Loader';

const CustomerOverview = () => {
  const { data, loading } = useQuery(getCustomerQuery);

  const customers = data?.customers;
  if (loading) return <Loader />;

  return (
    <CustomerOverviewContainer py={['30px', '100px']} px="24px">
      <Div useFlex flexDirection="column" minHeight="80vh">
        <Div useFlex mb="70px" alignItems="flex-end" justifyContent="center">
          <Logo width={150} />
          <H1 mb={0} fontSize={[40, 100]} textAlign="center" color="white" ml={4}>
            haas
          </H1>
        </Div>

        <Grid gridTemplateColumns="repeat(auto-fit, minmax(300px, 1fr))" gridGap="24px">
          {customers?.map((customer: any, index: number) => {
            return <CustomerCard key={index} customer={customer} />;
          })}
        </Grid>
      </Div>
    </CustomerOverviewContainer>
  );
};

export default CustomerOverview;
