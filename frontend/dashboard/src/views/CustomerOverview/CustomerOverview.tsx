import { useMutation } from '@apollo/react-hooks';
import Color from 'color';
import React, { useState } from 'react';

import {
  AddCard, Card, CardBody, Container, Flex, Grid, H3, H4, PageHeading, ColumnFlex, Span,
} from '@haas/ui';
import { Plus } from 'react-feather';
import { Link, useHistory } from 'react-router-dom';
import { TranslatedPlus } from 'views/DialogueOverview/DialogueOverviewStyles';
import { useCustomer } from 'providers/CustomerProvider';
import SurveyIcon from 'components/Icons/SurveyIcon';

import { ErrorBoundary } from 'react-error-boundary';
import { CustomerCardImage, CustomerOverviewContainer } from './CustomerOverviewStyles';
import { deleteFullCustomerQuery } from '../../mutations/deleteFullCustomer';
import { getCustomerQuery } from '../../queries/getCustomersQuery';
import { isValidColor } from '../../utils/ColorUtils';
import { Popover, PopoverTrigger, PopoverContent, PopoverBody, useToast, ButtonGroup, Button, PopoverArrow, PopoverHeader, PopoverCloseButton, PopoverFooter } from '@chakra-ui/core';

const CustomerOverview = ({ customers }: { customers: any[] }) => (
  <CustomerOverviewContainer>
    <Container>
      <PageHeading>Customers</PageHeading>

      <Grid
        gridGap={4}
        gridTemplateColumns={['1fr', '1fr 1fr 1fr']}
        gridAutoRows="minmax(200px, 1fr)"
      >
        {customers?.map((customer: any, index: any) => customer && (
          <ErrorBoundary key={index} FallbackComponent={() => (<></>)}>
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
  const { setActiveCustomer } = useCustomer();
  const toast = useToast();
  const [] = useState(false);


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

  const handleDeleteCustomer = async (customerId: string, onComplete: (() => void) | undefined) => {
    deleteCustomer({
      variables: {
        id: customerId,
      },
    }).finally(() => onComplete && onComplete());
  };

  const primaryColor = isValidColor(customer.settings?.colourSettings.primary)
    ? Color(customer.settings?.colourSettings.primary)
    : Color('white');

  return (
    <Card
      useFlex
      flexDirection="column"
      backgroundColor={primaryColor.hex()}
      onClick={() => setCustomerSlug(customer.slug)}
      data-cy="CustomerCard"
    >
      <CardBody flex="100%">
        <ColumnFlex justifyContent="space-between">
          <H3  
            color={primaryColor.isDark() ? 'white' : '#444'}
            fontWeight={500}
          >
            {customer.name}
          </H3>
          <ButtonGroup zIndex={150} mt={2}>
            <Button 
              size="xs" 
              variant="outline"
              leftIcon="arrow-forward"
              color={primaryColor.lighten(0.6).hex()}
              borderColor={primaryColor.lighten(0.6).hex()}
            >
              Visit
            </Button>
            <Button 
              size="xs" 
              variant="outline"
              leftIcon="edit"
              color={primaryColor.lighten(0.6).hex()}
              borderColor={primaryColor.lighten(0.6).hex()}
              onClick={(e) => setCustomerEditPath(e, customer.slug)}
            >
              Edit
            </Button>
            <Span onClick={e => e.stopPropagation()}>
              <Popover
                usePortal
              >
              {({ isOpen, onClose }) => (
                <>
                  <PopoverTrigger>
                    <Button 
                      size="xs" 
                      variant="outline"
                      leftIcon="delete"
                      color={primaryColor.lighten(0.6).hex()}
                      borderColor={primaryColor.lighten(0.6).hex()}
                    >
                      Delete
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent zIndex={4}>
                    <PopoverArrow />
                    <PopoverHeader>Delete</PopoverHeader>
                    <PopoverCloseButton />
                    <PopoverBody>
                      <p>You are about to delete a customer. Are you sure?</p>
                    </PopoverBody>
                    <PopoverFooter>
                      <Button variantColor="red" onClick={(e) => handleDeleteCustomer(customer.id, onClose) }>Delete</Button>
                    </PopoverFooter>
                  </PopoverContent>
                </>
              )}
              </Popover>
            </Span>
          </ButtonGroup>
        </ColumnFlex>

        {customer?.settings?.logoUrl && <CustomerCardImage src={customer?.settings?.logoUrl} />}
      </CardBody>
    </Card>
  );
};

export default CustomerOverview;
