import React, { FC } from 'react';
import { useQuery, useMutation } from '@apollo/react-hooks';
import { ApolloError } from 'apollo-boost';

import { Plus, X } from 'react-feather';
import { H2, H3, Grid, Flex, Div, Card, CardBody,
  Container, DeleteButtonContainer, AddCard } from '@haas/ui';
import { Link, useHistory } from 'react-router-dom';
import { Query, Customer } from '../../types';

import { getCustomerQuery } from '../../queries/getCustomerQuery';
import { deleteFullCustomerQuery } from '../../mutations/deleteFullCustomer';
import { CustomerCardImage } from './DashboardViewStyles';

const DashboardView: FC = () => {
  const { loading, error, data } = useQuery<Query>(getCustomerQuery);

  if (loading) return <p>Loading</p>;

  if (error) {
    return (
      <p>
        Error:
        {error.message}
        `
      </p>
    );
  }

  const topics = data?.customers;

  return (
    <>
      <Container>
        <H2 color="default.primary" fontWeight={400} mb={4}>Customers</H2>

        <Grid
          gridGap={4}
          gridTemplateColumns={['1fr', '1fr 1fr 1fr']}
          gridAutoRows="minmax(200px, 1fr)"
        >
          {topics?.map((topic, index) => topic && <CustomerCard key={index} customer={topic} />)}

          <AddCard>
            <Link to="/customer-builder" />
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

const CustomerCard = ({ customer }: { customer: Customer }) => {
  const history = useHistory();

  const setCustomerID = (customerId: string) => {
    history.push(`/c/${customerId}`);
  };

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
        <DeleteButtonContainer
          onClick={(e) => deleteClickedCustomer(e, customer.id)}
        >
          <X />
        </DeleteButtonContainer>
        <Flex alignItems="center" justifyContent="space-between">
          <H3 fontWeight={500}>
            {customer.name}
          </H3>
          <CustomerCardImage src={customer?.settings?.logoUrl ? customer?.settings?.logoUrl : ''} />
        </Flex>
      </CardBody>
    </Card>
  );
};

export default DashboardView;
