import { ApolloError } from 'apollo-boost';
import { useMutation, useQuery } from '@apollo/react-hooks';
import Color from 'color';
import React, { FC } from 'react';

import { AddCard, Card, CardBody, Container, DeleteButtonContainer, Div,
  EditButtonContainer, Flex, Grid, H2, H3, H4, PageHeading } from '@haas/ui';
import { Edit, Plus, X } from 'react-feather';
import { Link, useHistory } from 'react-router-dom';

import { CustomerCardImage, CustomerOverviewContainer } from './CustomerOverviewStyles';
import { deleteFullCustomerQuery } from '../../mutations/deleteFullCustomer';
import { getCustomerQuery } from '../../queries/getCustomersQuery';

const CustomerOverview = ({ customers }: { customers: any[] }) => (
  <CustomerOverviewContainer>
    <Container>
      <PageHeading>Customers</PageHeading>

      <Grid
        gridGap={4}
        gridTemplateColumns={['1fr', '1fr 1fr 1fr']}
        gridAutoRows="minmax(250px, 1fr)"
      >
        {customers?.map((customer: any, index: any) => customer && <CustomerCard key={index} customer={customer} />)}

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

  const setCustomerSlug = (customerSlug: string) => {
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

  const primaryColor = Color(customer.settings?.colourSettings.primary || 'white');

  return (
    <Card
      useFlex
      flexDirection="column"
      backgroundColor={primaryColor.hex()}
      color={primaryColor.isDark() ? 'white' : '#444'}
      onClick={() => setCustomerSlug(customer.slug)}
    >
      <CardBody flex="100%">
        <Div>
          <EditButtonContainer onClick={(e) => setCustomerEditPath(e, customer.id)}>
            <Edit />
          </EditButtonContainer>
          <DeleteButtonContainer
            onClick={(e) => deleteClickedCustomer(e, customer.id)}
          >
            <X />
          </DeleteButtonContainer>
        </Div>
        <Flex alignItems="center" justifyContent="space-between">
          <H3 fontWeight={500}>
            {customer.name}
          </H3>
          <CustomerCardImage src={customer?.settings?.logoUrl} />
        </Flex>
      </CardBody>
    </Card>
  );
};

export default CustomerOverview;
