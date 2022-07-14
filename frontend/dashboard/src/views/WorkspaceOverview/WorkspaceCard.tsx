import * as UI from '@haas/ui';
import {
  Button, ButtonGroup, Popover, PopoverArrow, PopoverBody,
  PopoverCloseButton, PopoverContent, PopoverFooter, PopoverHeader, PopoverTrigger, useToast,
} from '@chakra-ui/core';
import { useHistory } from 'react-router';
import { useMutation } from '@apollo/client';
import { useTranslation } from 'react-i18next';
import Color from 'color';
import React from 'react';

import { deleteFullCustomerQuery } from 'mutations/deleteFullCustomer';
import { isValidColor } from 'utils/ColorUtils';
import { useUser } from 'providers/UserProvider';
import getCustomersOfUser from 'queries/getCustomersOfUser';
import useAuth from 'hooks/useAuth';

import { WorkspaceCardImage } from './WorkspaceOverview.styles';

const WorkspaceCard = ({ customer }: { customer: any }) => {
  const history = useHistory();
  const toast = useToast();
  const { t } = useTranslation();
  const { user, refreshUser } = useUser();
  const { canDeleteCustomers } = useAuth();

  const setCustomerSlug = (customerSlug: string) => {
    localStorage.setItem('customer', JSON.stringify(customer));
    history.push(`/dashboard/b/${customerSlug}`);
  };

  const [deleteCustomer] = useMutation(deleteFullCustomerQuery, {
    refetchQueries: [{ query: getCustomersOfUser, variables: { userId: user?.id } }],
    onError: () => {
      refreshUser();
      toast({
        title: 'Something went wrong',
        description: 'There was a problem with deleting the customer.',
        status: 'error',
        position: 'bottom-right',
        isClosable: true,
      });
    },
    onCompleted: () => {
      refreshUser();
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
    <UI.Card
      height="100%"
      flexDirection="column"
      onClick={() => setCustomerSlug(customer.slug)}
      style={{ borderColor: 'transparent', borderRadius: 20, backgroundColor: primaryColor.hex() }}
      hasHover
      data-cy="CustomerCard"
      data-testid="CustomerCard"
    >
      <UI.CardBody flex="100%">
        <UI.ColumnFlex justifyContent="space-between">
          <UI.H3
            color={primaryColor.isDark() ? 'white' : '#444'}
            fontWeight={500}
          >
            {customer.name}
          </UI.H3>
          <ButtonGroup zIndex={150} mt={2}>
            <Button
              size="xs"
              variant="outline"
              leftIcon="arrow-forward"
              color={primaryColor.lighten(0.6).hex()}
              borderColor={primaryColor.lighten(0.6).hex()}
            >
              {t('visit')}
            </Button>
            {canDeleteCustomers && (
              <UI.Span onClick={(e) => e.stopPropagation()}>
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
                          {t('delete')}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent zIndex={4}>
                        <PopoverArrow />
                        <PopoverHeader>{t('delete')}</PopoverHeader>
                        <PopoverCloseButton />
                        <PopoverBody>
                          <UI.Text>{t('delete_customer_popover')}</UI.Text>
                        </PopoverBody>
                        <PopoverFooter>
                          <Button
                            data-testid="DeleteWorkspaceButton"
                            variantColor="red"
                            onClick={() => handleDeleteCustomer(customer.id, onClose)}
                          >
                            {t('delete')}
                          </Button>
                        </PopoverFooter>
                      </PopoverContent>
                    </>
                  )}
                </Popover>
              </UI.Span>
            )}
          </ButtonGroup>
        </UI.ColumnFlex>

        {customer?.settings?.logoUrl && <WorkspaceCardImage src={customer?.settings?.logoUrl} />}
      </UI.CardBody>
    </UI.Card>
  );
};

export default WorkspaceCard;
