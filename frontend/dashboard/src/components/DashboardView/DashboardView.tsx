import React, { FC } from 'react';
import { useQuery, useMutation } from '@apollo/react-hooks';
import { ApolloError } from 'apollo-boost';

import { Plus, X, Edit } from 'react-feather';
import { H2, H3, Grid, Flex, Div, Card, CardBody,
  Container, DeleteButtonContainer, AddCard, EditButtonContainer } from '@haas/ui';
import { Link, useHistory } from 'react-router-dom';

import { getCustomerQuery } from '../../queries/getCustomersQuery';
import { deleteFullCustomerQuery } from '../../mutations/deleteFullCustomer';
import { CustomerCardImage } from './DashboardViewStyles';

const DashboardView: FC = () => {
  const { loading, error, data } = useQuery(getCustomerQuery);

  console.log(error);
  console.log(loading);

  if (error) {
    return (
      <p>
        Error:
        {error.message}
        `
      </p>
    );
  }

  if (loading) return <p>Loading</p>;

  const customers = data?.customers;

  return (
    <>
      <Container>
        <H2 color="default.primary" fontWeight={400} mb={4}>Customers</H2>

        <Grid
          gridGap={4}
          gridTemplateColumns={['1fr', '1fr 1fr 1fr']}
          gridAutoRows="minmax(150px, 1fr)"
        >
          {customers?.map((customer: any, index: any) => customer && <CustomerCard key={index} customer={customer} />)}

          <AddCard>
            <Link to="/dashboard/customer-builder" />
            <Div>
              <Plus />
              <H3>
                Add new customer
              </H3>
            </Div>
          </AddCard>
        </Grid>
      </Container>
    </>
  );
};

const CustomerCard = ({ customer }: { customer: any }) => {
  const history = useHistory();

  const setCustomerID = (customerId: string) => {
    history.push(`/dashboard/c/${customerId}`);
  };

  const setCustomerEditPath = (event: any, customerId: string) => {
    history.push(`/dashboard/c/${customerId}/edit`);
    event.stopPropagation();
  }

  const [deleteCustomer] = useMutation(deleteFullCustomerQuery, {
    refetchQueries: [{ query: getCustomerQuery }],
    onError: (serverError: ApolloError) => {
      console.log(serverError);
    },
  });

  const deleteClickedCustomer = async (event: any, customerId: string) => {
    deleteCustomer({
      variables: {
        id: customerId,
      },
    });
    event.stopPropagation();
  };

  return (
    <Card
      useFlex
      flexDirection="column"
      bg={customer.settings?.colourSettings?.primary || 'white'}
      onClick={() => setCustomerID(customer.id)}
    >
      <CardBody flex="100%">
        <EditButtonContainer onClick={(e) => setCustomerEditPath(e, customer.id)}>
          <Edit />
        </EditButtonContainer>
        <DeleteButtonContainer
          onClick={(e) => deleteClickedCustomer(e, customer.id)}
        >
          <X />
        </DeleteButtonContainer>
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

export default DashboardView;
