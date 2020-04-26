import React, { FC } from 'react';
import { useQuery, useMutation } from '@apollo/react-hooks';
import { ApolloError } from 'apollo-boost';

import { Plus, X } from 'react-feather';
import { H2, H3, Grid, Flex, Div, Card, CardBody, Container } from '@haas/ui';
import { Link, useHistory } from 'react-router-dom';
import styled, { css } from 'styled-components/macro';
import { Query, Customer } from '../types.d';

import { getCustomerQuery } from '../queries/getCustomerQuery';
import { deleteFullCustomerQuery } from '../mutations/deleteFullCustomer';

const DeleteCustomerButtonContainer = styled.button`
  position: absolute;
  top: 5px;
  right: 5px;
  background: none;
  border: none;
  opacity: 0.1;
  cursor: pointer;
  transition: all 0.2s ease-in;

  &:hover {
    transition: all 0.2s ease-in;
    opacity: 0.8;
  }
`;

const DashboardView: FC = () => {
  const { loading, error, data } = useQuery<Query>(getCustomerQuery);

  if (loading) return <p>Loading</p>;

  if (error) {
    return (
      <p>
        Error:
        {' '}
        {error.message}
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

          <AddTopicCard>
            <Link to="/customer-builder" />
            <Div>
              <Plus />
              <H3>
                Add new customer
              </H3>
            </Div>
          </AddTopicCard>
        </Grid>
      </Container>
    </>
  );
};

const AddTopicCard = styled(Card)`
  ${({ theme }) => css`
    position: relative;

    &:hover ${Div} {
      transition: all 0.2s ease-in;
      box-shadow: 0 1px 3px 1px rgba(0,0,0,0.1);
    }

    ${Div} {
      height: 100%;
      border: 1px solid ${theme.colors.default.light};
      transition: all 0.2s ease-in;
      display: flex;
      align-items: center;
      flex-direciton: column;
      justify-content: center;
      background: ${theme.colors.default.light};
    }

    a {
      position: absolute;
      left: 0;
      right: 0;
      bottom: 0;
      top: 0;
      text-decoration: none;
    }
  `}
`;

const CustomerCardImage = styled.img`
  width: 75px;
  height: 75px;
`;

const CustomerCard = ({ customer }: { customer: Customer }) => {
  const history = useHistory();

  const setCustomerID = (customerId: string) => {
    history.push(`/c/${customerId}`);
  };

  const [deleteCustomer] = useMutation(deleteFullCustomerQuery, {
    onCompleted: () => {
      console.log('Succesfully deleted customer !');
    },
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
        <DeleteCustomerButtonContainer
          onClick={(e) => deleteClickedCustomer(e, customer.id)}
        >
          <X />
        </DeleteCustomerButtonContainer>
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
