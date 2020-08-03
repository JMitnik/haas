import { ApolloError } from 'apollo-boost';
import { useMutation } from '@apollo/react-hooks';
import Color from 'color';
import React from 'react';

import {
  AddCard, Card, CardBody, Container, DeleteButtonContainer, Div,
  EditButtonContainer, Flex, Grid, H3, PageHeading,
} from '@haas/ui';
import { Edit, Plus, X } from 'react-feather';
import { Link, useHistory } from 'react-router-dom';
import { useCustomer } from 'providers/CustomerProvider';

import { ErrorBoundary } from 'react-error-boundary';
import { CustomerCardImage, CustomerOverviewContainer } from './CustomerOverviewStyles';
import { deleteFullCustomerQuery } from '../../mutations/deleteFullCustomer';
import { getCustomerQuery } from '../../queries/getCustomersQuery';
import { isValidColor } from '../../utils/ColorUtils';

const CustomerOverview = ({ customers }: { customers: any[] }) => (
  <CustomerOverviewContainer>
    <Container>
      <PageHeading>Customers</PageHeading>

      <Grid
        gridGap={4}
        gridTemplateColumns={['1fr', '1fr 1fr 1fr']}
        gridAutoRows="minmax(250px, 1fr)"
      >
        {customers?.map((customer: any, index: any) => customer && (
          <ErrorBoundary FallbackComponent={() => (<></>)}>
            <CustomerCard key={index} customer={customer} />
          </ErrorBoundary>
        ))}

        <AddCard>
          <Link to="/dashboard/b/add" />
          <Div>
            <Plus />
            <H3>
              Add new customer
            </H3>
          </Div>
        </AddCard>
      </Grid>
    </Container>
  </CustomerOverviewContainer>
);

const CustomerCard = ({ customer }: { customer: any }) => {
  const history = useHistory();
  const { activeCustomer, setActiveCustomer } = useCustomer();
  const setCustomerSlug = (customerSlug: string) => {
    if (activeCustomer?.slug !== customerSlug) {
      // TODO: Stor active customer in LocalStorage
      localStorage.setItem('customer', JSON.stringify(customer));
      setActiveCustomer(customer);
    }
    history.push(`/dashboard/b/${customerSlug}`);
  };

  const setCustomerEditPath = (event: any, customerSlug: string) => {
    history.push(`/dashboard/b/${customerSlug}/edit`);
    event.stopPropagation();
  };

  const [deleteCustomer] = useMutation(deleteFullCustomerQuery, {
    refetchQueries: [{ query: getCustomerQuery }],
    onError: (serverError: ApolloError) => {
      console.log(serverError);
    },
  });

  const deleteClickedCustomer = async (event: any, customerSlug: string) => {
    deleteCustomer({
      variables: {
        id: customerSlug,
      },
    });
    event.stopPropagation();
  };

  const primaryColor = isValidColor(customer.settings?.colourSettings.primary)
    ? Color(customer.settings?.colourSettings.primary)
    : Color('white');

  return (
    <Card
      useFlex
      flexDirection="column"
      backgroundColor={primaryColor.hex()}
      color={primaryColor.isDark() ? 'white' : '#444'}
      onClick={() => setCustomerSlug(customer.slug)}
      data-cy="CustomerCard"
    >
      <CardBody flex="100%">
        <Div>
          <EditButtonContainer
            data-cy="EditCustomerButton"
            onClick={(e) => setCustomerEditPath(e, customer.slug)}
          >
            <Edit />
          </EditButtonContainer>
          <DeleteButtonContainer
            data-cy="DeleteCustomerButton"
            onClick={(e) => deleteClickedCustomer(e, customer.id)}
          >
            <X />
          </DeleteButtonContainer>
        </Div>
        <Flex alignItems="center" justifyContent="space-between">
          <H3 fontWeight={500}>
            {customer.name}
          </H3>
          {customer?.settings?.logoUrl && <CustomerCardImage src={customer?.settings?.logoUrl} />}
        </Flex>
      </CardBody>
    </Card>
  );
};

export default CustomerOverview;
