import * as UI from '@haas/ui';
import { Activity, Bell, Briefcase } from 'react-feather';
import {
  Button, Popover, PopoverArrow, PopoverBody, PopoverCloseButton, PopoverContent,
  PopoverFooter, PopoverHeader, PopoverTrigger, Switch, useToast,
} from '@chakra-ui/core';

import { formatDistance } from 'date-fns';
import { useMutation } from '@apollo/client';
import { useParams } from 'react-router';
import { useTranslation } from 'react-i18next';
import React, { useRef } from 'react';

import {
  AutomationModel,
  AutomationType,
  EnableAutomationInput,
  useEnableAutomationMutation,
} from 'types/generated-types';
import { deleteDialogueMutation } from 'mutations/deleteDialogue';
import { useCustomer } from 'providers/CustomerProvider';
import ShowMoreButton from 'components/ShowMoreButton';
import getDialoguesOfCustomer from 'queries/getDialoguesOfCustomer';
import getLocale from 'utils/getLocale';
import useAuth from 'hooks/useAuth';

import { TypeBadge } from './AutomationOverviewStyles';

interface DialogueCardOptionsOverlayProps {
  onDelete: (e: React.MouseEvent<HTMLElement>) => void;
  onEdit: (e: React.MouseEvent<HTMLElement>) => void;
}

const DialogueCardOptionsOverlay = ({ onDelete, onEdit }: DialogueCardOptionsOverlayProps) => {
  const { t } = useTranslation();

  return (
    <UI.List>
      <UI.ListHeader>{t('edit_dialogue')}</UI.ListHeader>
      <Popover>
        {() => (
          <>
            <PopoverTrigger>
              <UI.ListItem>
                {t('delete')}
              </UI.ListItem>
            </PopoverTrigger>
            <PopoverContent zIndex={4}>
              <PopoverArrow />
              <PopoverHeader>{t('delete')}</PopoverHeader>
              <PopoverCloseButton />
              <PopoverBody>
                <UI.Text>{t('delete_dialogue_popover')}</UI.Text>
              </PopoverBody>
              <PopoverFooter>
                <Button
                  variantColor="red"
                  onClick={onDelete}
                >
                  {t('delete')}
                </Button>
              </PopoverFooter>
            </PopoverContent>
          </>
        )}
      </Popover>
      <UI.ListItem onClick={onEdit}>
        {t('edit')}
      </UI.ListItem>
    </UI.List>
  );
};

const DialogueCard = ({ automation, isCompact }: { automation: AutomationModel, isCompact?: boolean }) => {
  const { customerSlug } = useParams<{ customerSlug: string }>();
  const { activeCustomer } = useCustomer();
  const { canAccessAdmin } = useAuth();
  const ref = useRef(null);
  const { t } = useTranslation();
  const toast = useToast();

  const [enableAutomation] = useEnableAutomationMutation();

  const [deleteDialogue] = useMutation(deleteDialogueMutation, {
    refetchQueries: [{
      query: getDialoguesOfCustomer,
      variables: {
        customerSlug,
      },
    }],
    onCompleted: () => {
      toast({
        title: 'Dialogue deleted',
        description: 'The dialogue has been deleted.',
        status: 'success',
        position: 'bottom-right',
        duration: 1500,
      });
    },
    onError: () => {
      toast({
        title: 'Something went wrong!',
        description: 'The dialogue was not deleted.',
        status: 'error',
        position: 'bottom-right',
        duration: 1500,
      });
    },
  });

  const handleDeleteDialogue = async (e: React.MouseEvent<HTMLElement>) => {
    e.stopPropagation();

    deleteDialogue({
      variables: {
        input: {
          id: automation.id,
          customerSlug,
        },
      },
    });
  };

  // TODO: Move this url to a constant or so and add back for automation
  const goToEditDialogue = (e: React.MouseEvent<HTMLElement>) => {
    e.stopPropagation();
    // history.push(`/dashboard/b/${customerSlug}/d/${dialogue.slug}/edit`);
  };

  const handleEnableChange = (e: React.MouseEvent<HTMLElement>) => {
    e.stopPropagation();

    const input: EnableAutomationInput = {
      automationId: automation.id,
      workspaceId: activeCustomer?.id as string,
      state: !automation.isActive,
    };

    enableAutomation({
      variables: {
        input,
      },
    });
  };

  const renderAutomationTypeColor = (type: AutomationType) => {
    switch (type) {
      case AutomationType.Trigger:
        return '#7069FA';
      case AutomationType.Campaign:
        return '#2CB1BC';
      default:
        return '#AFB4C6';
    }
  };

  const automationTypeColour = renderAutomationTypeColor(automation.type);
  const lastUpdated = automation.updatedAt ? new Date(Number.parseInt(automation.updatedAt, 10)) : null;

  return (
    <UI.Card
      ref={ref}
      data-cy="DialogueCard"
      bg="white"
      useFlex
      flexDirection="column"
      position="relative"
    // onClick={() => history.push(`/dashboard/b/${customerSlug}/d/${dialogue.slug}`)} // TODO: Add back
    >
      <UI.AccentBorder backgroundColor={automationTypeColour} />
      <UI.CardBody flex="100%">
        <UI.ColumnFlex height="100%">

          <UI.Flex paddingBottom="1em" alignItems="baseline" justifyContent="space-between">
            <TypeBadge>
              <Bell color={automationTypeColour} />
            </TypeBadge>
            <Switch
              isChecked={automation.isActive}
              onClick={handleEnableChange}
              size="lg"
            />
          </UI.Flex>

          <UI.ColumnFlex height="100%" justifyContent="space-between">
            <UI.Div>
              <UI.Flex justifyContent="space-between" alignItems="center">
                <UI.Text fontSize={isCompact ? '1.1rem' : '1.4rem'} color="app.onWhite" mb={2} fontWeight={500}>
                  {automation.label}
                </UI.Text>
              </UI.Flex>
            </UI.Div>

            <UI.Div>
              {automation.automationTrigger?.dialogueSlug && (
                <UI.Div mb={1}>
                  <UI.Label size="sm">
                    <UI.Flex alignItems="center">
                      <UI.Icon stroke="#718096" verticalAlign="middle" mt="4px">
                        <Briefcase />
                      </UI.Icon>
                      <UI.Span ml={1} mt={1}>
                        <UI.Helper>
                          {automation.automationTrigger?.dialogueSlug}
                        </UI.Helper>
                      </UI.Span>
                    </UI.Flex>
                  </UI.Label>
                </UI.Div>
              )}
              {automation.automationTrigger?.actions?.length && automation.automationTrigger?.actions.map((action) => (
                <UI.Div mb={1}>
                  <UI.Label size="sm">
                    <UI.Flex alignItems="center">
                      <UI.Icon stroke="#718096" verticalAlign="middle" mt="4px">
                        <Activity />
                      </UI.Icon>
                      <UI.Span ml={1}>
                        <UI.Helper>
                          {action.type?.replaceAll('_', ' ')}
                        </UI.Helper>
                      </UI.Span>
                    </UI.Flex>
                  </UI.Label>
                </UI.Div>
              ))}

              <UI.Flex alignItems="center" justifyContent="space-between">
                <UI.Div>
                  {lastUpdated && (
                    <UI.Text fontSize="0.7rem" color="gray.300">
                      {t('last_updated', {
                        date: formatDistance(lastUpdated, new Date(), {
                          locale: getLocale(),
                        }),
                      })}
                    </UI.Text>
                  )}
                </UI.Div>
                <UI.Div>
                  {canAccessAdmin && (
                    <ShowMoreButton
                      renderMenu={(
                        <DialogueCardOptionsOverlay
                          onDelete={handleDeleteDialogue}
                          onEdit={goToEditDialogue}
                        />
                      )}
                    />
                  )}
                </UI.Div>
              </UI.Flex>
            </UI.Div>
          </UI.ColumnFlex>

        </UI.ColumnFlex>

      </UI.CardBody>
    </UI.Card>
  );
};

export default DialogueCard;
