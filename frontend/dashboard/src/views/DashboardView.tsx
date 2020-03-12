import React, { FC } from 'react';
import { useQuery, useApolloClient, useMutation } from '@apollo/react-hooks';
import { gql, ApolloError } from 'apollo-boost';

import { ChevronRight, Plus } from 'react-feather';
import { H2, H3, H4, Grid, Flex, Icon, Label, Div, Card, CardBody, CardFooter } from '@haas/ui';
import { Link, useHistory } from 'react-router-dom';
import styled, { css } from 'styled-components';
import { Query, Questionnaire, Customer } from '../types.d';

import { getCustomerQuery } from '../queries/getCustomerQuery';
import { deleteFullCustomerQuery } from '../mutations/deleteFullCustomer';

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
      <H2 color="default.text" fontWeight={400} mb={4}>Customers</H2>

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

  const [deleteCustomer, { loading }] = useMutation(deleteFullCustomerQuery, {
    onCompleted: () => {
      console.log('Succesfully deleted customer !');
    },
    refetchQueries: [{ query: getCustomerQuery }],
    onError: (serverError: ApolloError) => {
      console.log(serverError);
    },
  });

  const deleteClickedCustomer = async (customerId: string) => {
    deleteCustomer({
      variables: {
        id: customerId,
      },
    });
  };

  return (
    <Card
      useFlex
      flexDirection="column"
      backgroundColor={customer.settings?.colourSettings?.primary
        ? customer.settings?.colourSettings?.primary : 'white'}
    >
      <CardBody flex="100%">
        <button type="button" onClick={() => deleteClickedCustomer(customer.id)}>DELETE ME PLS</button>
        <Flex alignItems="center" justifyContent="space-between">
          <H3 fontWeight={500}>
            {customer.name}
          </H3>
          <CustomerCardImage src={customer?.settings?.logoUrl ? customer?.settings?.logoUrl : ''} />
        </Flex>
      </CardBody>
      <CardFooter useFlex justifyContent="center" alignItems="center" onClick={() => setCustomerID(customer.id)}>
        <H4>
          View project
        </H4>
        <Icon pl={1} fontSize={1}>
          <ChevronRight />
        </Icon>
      </CardFooter>
    </Card>
  );
};

export default DashboardView;
