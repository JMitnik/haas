import { motion } from 'framer-motion';
import { useQuery } from '@apollo/react-hooks';
import React from 'react';

import { CustomerOverviewContainer } from 'components/CustomerOverview/CustomerOverviewStyles';
import { Div, Grid, H1 } from '@haas/ui';
import { getCustomerQuery } from 'queries/getCustomerQuery';
import CustomerCard from 'components/CustomerCard/CustomerCard';
import Loader from 'components/Loader';
import Logo from 'components/Logo';

const CustomerOverview = () => {
  const { data, loading } = useQuery(getCustomerQuery);

  const customers = data?.customers;
  if (loading) return <Loader />;

  return (
    <motion.div exit={{ opacity: 0 }}>
      <CustomerOverviewContainer py={['30px', '100px']} px="24px">
        <Div useFlex flexDirection="column" minHeight="80vh">
          <Div useFlex mb="70px" alignItems="flex-end" justifyContent="center">
            <Logo width={150} />
            <H1 mb={0} fontSize={[40, 100]} textAlign="center" color="white" ml={4}>
              haas
            </H1>
          </Div>

          <Grid gridTemplateColumns="repeat(auto-fit, minmax(300px, 1fr))" gridGap="24px">
            {customers?.map((customer: any, index: number) => <CustomerCard key={index} customer={customer} />)}
          </Grid>
        </Div>
      </CustomerOverviewContainer>
    </motion.div>
  );
};

export default CustomerOverview;
