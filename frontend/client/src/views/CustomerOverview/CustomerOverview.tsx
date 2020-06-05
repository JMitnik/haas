import React, { useEffect } from 'react';

import { CustomerOverviewContainer } from 'views/CustomerOverview/CustomerOverviewStyles';
import { Div, Grid, H1 } from '@haas/ui';
import CustomerCard from 'components/CustomerCard/CustomerCard';
import Logo from 'components/Logo';
import useDialogueTree from 'providers/DialogueTreeProvider';

const CustomerOverview = ({ customers }: { customers: any }) => {
  const store = useDialogueTree();

  useEffect(() => {
    if (store.customer) {
      store.resetProject();
    }
  }, [store.customer, store.resetProject, store]);

  return (
    <CustomerOverviewContainer exit={{ opacity: 0 }}>
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
  );
};

export default CustomerOverview;
