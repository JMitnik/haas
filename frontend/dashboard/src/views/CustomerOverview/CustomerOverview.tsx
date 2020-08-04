import { ApolloError } from 'apollo-boost';
import { useMutation } from '@apollo/react-hooks';
import Color from 'color';
import React, { useState } from 'react';

import {
  AddCard, Card, CardBody, Container, DeleteButtonContainer, Div,
  EditButtonContainer, Flex, Grid, H3, H4, PageHeading, Button,
} from '@haas/ui';
import { Edit, Plus, X } from 'react-feather';
import { Link, useHistory } from 'react-router-dom';
import { TranslatedPlus } from 'views/DialogueOverview/DialogueOverviewStyles';
import { useCustomer } from 'providers/CustomerProvider';
import SurveyIcon from 'components/Icons/SurveyIcon';

import { ErrorBoundary } from 'react-error-boundary';
import { CustomerCardImage, CustomerOverviewContainer } from './CustomerOverviewStyles';
import { deleteFullCustomerQuery } from '../../mutations/deleteFullCustomer';
import { getCustomerQuery } from '../../queries/getCustomersQuery';
import { isValidColor } from '../../utils/ColorUtils';
import { Popover, PopoverTrigger, PopoverContent, PopoverBody, useToast } from '@chakra-ui/core';

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
          <Flex flexDirection="column" alignItems="center" justifyContent="center">
            <SurveyIcon />
            <TranslatedPlus>
              <Plus strokeWidth="3px" />
            </TranslatedPlus>
            <H4 color="default.dark">
              Create a customer
            </H4>
          </Flex>
        </AddCard>
      </Grid>
    </Container>
  </CustomerOverviewContainer>
);

const CustomerCard = ({ customer }: { customer: any }) => {
  const history = useHistory();
  const { activeCustomer, setActiveCustomer } = useCustomer();
  const toast = useToast();
  const [isOpenDelete, setIsOpenDelete] = useState(false);


  const setCustomerSlug = (customerSlug: string) => {
    localStorage.setItem('customer', JSON.stringify(customer));
    setActiveCustomer(customer);
    history.push(`/dashboard/b/${customerSlug}`);
  };

  const setCustomerEditPath = (event: any, customerSlug: string) => {
    history.push(`/dashboard/b/${customerSlug}/edit`);
    event.stopPropagation();
  };

  const [deleteCustomer] = useMutation(deleteFullCustomerQuery, {
    refetchQueries: [{ query: getCustomerQuery }],
    onError: () => {
      toast({
        title: 'Something went wrong',
        description: 'There was a problem with deleting the customer.',
        status: 'success',
        position: 'bottom-right',
        isClosable: true,
      });
    },
    onCompleted: () => {
      toast({
        title: 'Customer deleted!',
        description: 'The customer has been deleted.',
        status: 'success',
        position: 'bottom-right',
        duration: 1500,
      });
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
            onClick={(e) => e.stopPropagation()}
          >
            <Popover 
              usePortal
            >
              {({ isOpen, onClose }) => (
                <>
                  <PopoverTrigger>
                    <X />
                  </PopoverTrigger>
                  <PopoverContent zIndex={4}>
                    <PopoverBody>
                      <p>Are you sure?</p>
                      <Button onClick={(e) => {deleteClickedCustomer(e, customer.id); onClose && onClose();}}>Delete</Button>
                    </PopoverBody>
                  </PopoverContent>
                </>
              )}
            </Popover>
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
