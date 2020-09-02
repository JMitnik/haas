import { Button, ButtonGroup, Popover, PopoverArrow, PopoverBody,
  PopoverCloseButton, PopoverContent, PopoverFooter, PopoverHeader, PopoverTrigger, useToast } from '@chakra-ui/core';
import { useHistory } from 'react-router';
import Color from 'color';
import React from 'react';

import { Card, CardBody, ColumnFlex, H3, Span } from '@haas/ui';
import { deleteFullCustomerQuery } from 'mutations/deleteFullCustomer';
import { isValidColor } from 'utils/ColorUtils';
import { useCustomer } from 'providers/CustomerProvider';
import { useMutation } from '@apollo/react-hooks';
import getCustomerQuery from 'queries/getCustomersQuery';

import { CustomerCardImage } from './CustomerOverviewStyles';

const CustomerCard = ({ customer }: { customer: any }) => {
  const history = useHistory();
  const { setActiveCustomer, setStorageCustomer } = useCustomer();
  const toast = useToast();

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
        status: 'error',
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
      setStorageCustomer(null);
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
      height="100%"
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
            <Span onClick={(e) => e.stopPropagation()}>
              <Popover
                usePortal
              >
                {({ onClose }) => (
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
                        <Button
                          variantColor="red"
                          onClick={() => handleDeleteCustomer(customer.id, onClose)}
                        >
                          Delete
                        </Button>
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

export default CustomerCard;
