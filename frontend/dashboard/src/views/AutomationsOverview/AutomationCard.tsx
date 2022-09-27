import * as Dropdown from 'components/Common/Dropdown';
import * as UI from '@haas/ui';
import { Activity, Bell, Briefcase, Clock } from 'react-feather';
import {
  Switch, useToast,
} from '@chakra-ui/core';

import { formatDistance } from 'date-fns';
import { useParams } from 'react-router';
import { useTranslation } from 'react-i18next';
import React, { useRef, useState } from 'react';

import {
  AutomationModel,
  AutomationType,
  DeleteAutomationInput,
  EnableAutomationInput,
  refetchAutomationConnectionQuery,
  useDeleteAutomationMutation,
  useEnableAutomationMutation,
} from 'types/generated-types';
import { useCustomer } from 'providers/CustomerProvider';
import { useNavigator } from 'hooks/useNavigator';
import ShowMoreButton from 'components/Common/ShowMoreButton';
import getLocale from 'utils/getLocale';
import useAuth from 'hooks/useAuth';

import { TypeBadge } from './AutomationOverviewStyles';

const AutomationCard = ({ automation, isCompact }: { automation: AutomationModel, isCompact?: boolean }) => {
  const { customerSlug } = useParams<{ customerSlug: string }>();
  const { activeCustomer } = useCustomer();
  const { canAccessAdmin, canUpdateAutomations } = useAuth();
  const [openDropdown, setIsOpenDropdown] = useState(false);
  const { goToEditAutomationView } = useNavigator();
  const ref = useRef(null);
  const { t } = useTranslation();
  const toast = useToast();

  const [enableAutomation] = useEnableAutomationMutation({
    onCompleted: () => {
      toast({
        title: 'Automation state changed',
        description: 'The automation has been updated.',
        status: 'success',
        position: 'bottom-right',
        duration: 1500,
      });
    },
  });

  const [deleteAutomation] = useDeleteAutomationMutation({
    refetchQueries: ['automationConnection'],
    onCompleted: () => {
      toast({
        title: 'Automation deleted',
        description: 'The automation has been deleted.',
        status: 'success',
        position: 'bottom-right',
        duration: 1500,
      });
    },
    onError: (e) => {
      console.log('Something went wrong deleting automation: ', e.message);
      toast({
        title: 'Something went wrong!',
        description: 'The automation was not deleted.',
        status: 'error',
        position: 'bottom-right',
        duration: 1500,
      });
    },
  });

  const handleDeleteAutomation = async (e: React.MouseEvent<HTMLElement>) => {
    e.stopPropagation();
    const input: DeleteAutomationInput = {
      automationId: automation.id as string,
      workspaceId: activeCustomer?.id as string,
    };

    deleteAutomation({
      variables: {
        input,
      },
    });
  };

  const goToEditAutomation = (e: React.MouseEvent<HTMLElement>) => {
    e.stopPropagation();
    goToEditAutomationView(automation.id as string);
  };

  const handleEnableChange = (e: React.MouseEvent<HTMLElement>) => {
    e.stopPropagation();

    const input: EnableAutomationInput = {
      automationId: automation.id as string,
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
        return { primary: '#7069FA', secondary: '#B0ADF2' };
      case AutomationType.Scheduled:
        return { primary: '#2CB1BC', secondary: '#73D6DE' };
      default:
        return { primary: '#AFB4C6', secondary: '#DEDFE1' };
    }
  };

  const automationTypeColour = renderAutomationTypeColor(automation.type as AutomationType);
  const lastUpdated = automation.updatedAt ? new Date(Number.parseInt(automation.updatedAt, 10)) : null;

  return (
    <UI.Card
      ref={ref}
      data-cy="AutomationCard"
      bg="white"
      hasHover
      useFlex
      flexDirection="column"
      position="relative"
    >
      <UI.AccentBorder backgroundColor={automationTypeColour.primary} />
      <UI.CardBody flex="100%">
        <UI.ColumnFlex height="100%">

          <UI.Flex paddingBottom="1em" alignItems="baseline" justifyContent="space-between">
            <TypeBadge backgroundColor={automationTypeColour.secondary}>
              {automation.type === AutomationType.Trigger && (
                <Bell color={automationTypeColour.primary} />
              )}

              {automation.type === AutomationType.Scheduled && (
                <Clock color={automationTypeColour.primary} />
              )}
            </TypeBadge>
            <Switch
              isDisabled={!canUpdateAutomations && !canAccessAdmin}
              isChecked={automation.isActive || false}
              onClick={(e) => {
                if (canUpdateAutomations || canAccessAdmin) {
                  handleEnableChange(e);
                }
              }}
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
              {(automation.type === AutomationType.Trigger && automation.automationTrigger?.activeDialogue?.slug)
                && (
                  <UI.Div mb={1}>
                    <UI.Label size="sm">
                      <UI.Flex alignItems="center">
                        <UI.Icon stroke="#718096" verticalAlign="middle" mt="4px">
                          <Briefcase />
                        </UI.Icon>
                        <UI.Span ml={1} mt={1}>
                          <UI.Helper>
                            {automation.automationTrigger?.activeDialogue?.slug}
                          </UI.Helper>
                        </UI.Span>
                      </UI.Flex>
                    </UI.Label>
                  </UI.Div>
                )}

              {(automation.type === AutomationType.Scheduled
                && automation.automationScheduled?.activeDialogue?.slug) && (
                  <UI.Div mb={1}>
                    <UI.Label size="sm">
                      <UI.Flex alignItems="center">
                        <UI.Icon stroke="#718096" verticalAlign="middle" mt="4px">
                          <Briefcase />
                        </UI.Icon>
                        <UI.Span ml={1} mt={1}>
                          <UI.Helper>
                            {automation.automationScheduled?.activeDialogue?.slug}
                          </UI.Helper>
                        </UI.Span>
                      </UI.Flex>
                    </UI.Label>
                  </UI.Div>
                )}

              {automation.type === AutomationType.Trigger && automation.automationTrigger?.actions?.length
                && automation.automationTrigger?.actions.map((action) => (
                  <UI.Div mb={1}>
                    <UI.Label size="sm">
                      <UI.Flex alignItems="center">
                        <UI.Icon stroke="#718096" verticalAlign="middle" mt="4px">
                          <Activity />
                        </UI.Icon>
                        <UI.Span ml={1}>
                          <UI.Helper>
                            {action?.type?.replaceAll('_', ' ')}
                          </UI.Helper>
                        </UI.Span>
                      </UI.Flex>
                    </UI.Label>
                  </UI.Div>
                ))}

              {automation.type === AutomationType.Scheduled && automation.automationScheduled?.actions?.length
                && automation.automationScheduled?.actions.map((action) => (
                  <UI.Div mb={1}>
                    <UI.Label size="sm">
                      <UI.Flex alignItems="center">
                        <UI.Icon stroke="#718096" verticalAlign="middle" mt="4px">
                          <Activity />
                        </UI.Icon>
                        <UI.Span ml={1}>
                          <UI.Helper>
                            {action?.type?.replaceAll('_', ' ')}
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
                  {(canAccessAdmin || canUpdateAutomations) && (
                    <UI.Div onClick={(e) => e.stopPropagation()} ml={2} position="relative">
                      <Dropdown.Root open={openDropdown} onOpenChange={setIsOpenDropdown}>
                        <Dropdown.Trigger asChild>
                          <ShowMoreButton />
                        </Dropdown.Trigger>

                        <Dropdown.Content open={openDropdown}>
                          <Dropdown.Label>{t('automation')}</Dropdown.Label>
                          <Dropdown.Item onClick={(e) => goToEditAutomation(e)}>{t('edit')}</Dropdown.Item>
                          <UI.Hr />
                          <Dropdown.Item onClick={(e) => handleDeleteAutomation(e)}>{t('delete')}</Dropdown.Item>
                        </Dropdown.Content>
                      </Dropdown.Root>
                    </UI.Div>
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

export default AutomationCard;
