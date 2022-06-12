import * as Dropdown from 'components/Common/Dropdown';
import * as UI from '@haas/ui';
import { formatDistance } from 'date-fns';
import { useHistory } from 'react-router';
import { useTranslation } from 'react-i18next';
import React, { useRef, useState } from 'react';

import { ReactComponent as DEFlag } from 'assets/icons/flags/flag-de.svg';
import { ReactComponent as GBFlag } from 'assets/icons/flags/flag-gb.svg';
import { ReactComponent as NLFlag } from 'assets/icons/flags/flag-nl.svg';
import { ShowMoreButton } from 'components/Common/ShowMoreButton';

import { Avatar } from 'components/Common/Avatar';
import { useCustomer } from 'providers/CustomerProvider';
import {
  useDeleteDialogueMutation,
  useSetDialoguePrivacyMutation,
} from 'types/generated-types';
import { useNavigator } from 'hooks/useNavigator';
import { useToast } from 'hooks/useToast';
import { useUser } from 'providers/UserProvider';
import getLocale from 'utils/getLocale';
import useAuth from 'hooks/useAuth';

const DialogueCard = ({ dialogue }: { dialogue: any }) => {
  const history = useHistory();
  const { user } = useUser();
  const { activeCustomer } = useCustomer();
  const { customerSlug } = useNavigator();
  const { canAccessAdmin } = useAuth();
  const ref = useRef(null);
  const { t } = useTranslation();
  const toast = useToast();

  const [setDialoguePrivacy] = useSetDialoguePrivacyMutation({
    variables: {
      input: {
        dialogueSlug: dialogue.slug,
        customerId: activeCustomer?.id as string,
        state: !dialogue.isPrivate,
      },
    },
    refetchQueries: ['dialogueConnection'],
    onCompleted: (data) => {
      const state = data.setDialoguePrivacy?.isPrivate ? 'private' : 'public';
      toast.success({
        title: 'Dialogue privacy change',
        description: `The dialogue privacy settings have been changed to ${state}.`,
      });
    },
    onError: () => {
      toast.templates.error();
    },
  });

  const [deleteDialogue] = useDeleteDialogueMutation({
    onCompleted: () => {
      toast.success({
        title: t('delete_dialogue_complete'),
        description: t('delete_dialogue_complete_helper'),
      });
    },
    onError: (serverError: any) => {
      console.log(serverError);
    },
    refetchQueries: ['dialogueConnection'],
  });

  const renderFlag = (language: string): JSX.Element => {
    switch (language) {
      case 'ENGLISH':
        return <GBFlag />;
      case 'DUTCH':
        return (
          <NLFlag />
        );
      case 'GERMAN':
        return (
          <DEFlag />
        );
      default:
        return <GBFlag />;
    }
  };

  const lastUpdated = dialogue.updatedAt ? new Date(Number.parseInt(dialogue.updatedAt, 10)) : null;

  const [openDropdown, setIsOpenDropdown] = useState(false);

  return (
    <UI.NewCard
      ref={ref}
      data-cy="DialogueCard"
      hasHover
      bg="white"
      onClick={() => history.push(`/dashboard/b/${customerSlug}/d/${dialogue.slug}`)}
    >
      <UI.CardBody height="100%" flex="100%">
        <UI.ColumnFlex justifyContent="space-between" height="100%">
          <UI.Div>
            <UI.Flex justifyContent="space-between">
              <UI.Div style={{ wordBreak: 'break-all' }}>
                <UI.H4 color="off.600" fontWeight="700">
                  {dialogue.title}
                </UI.H4>
                <UI.ExtLink to={`https://client.haas.live/${dialogue.customer.slug}/${dialogue.slug}`} color="off.300">
                  {`${dialogue.customer.slug}/${dialogue.slug}`}
                </UI.ExtLink>
              </UI.Div>

              {canAccessAdmin && (
                <UI.Div onClick={(e) => e.stopPropagation()} ml={2} position="relative">
                  <Dropdown.Root open={openDropdown} onOpenChange={setIsOpenDropdown}>
                    <Dropdown.Trigger asChild>
                      <ShowMoreButton />
                    </Dropdown.Trigger>

                    <Dropdown.Content open={openDropdown}>
                      <Dropdown.Label>Dialogue</Dropdown.Label>
                      <Dropdown.NavItem to={`/dashboard/b/${customerSlug}/d/${dialogue.slug}/edit`}>
                        {t('edit')}
                      </Dropdown.NavItem>

                      <UI.Hr />

                      <Dropdown.CheckedItem isChecked={dialogue.isPrivate} onClick={() => setDialoguePrivacy()}>
                        {t('set_private')}
                      </Dropdown.CheckedItem>

                      <UI.Hr />

                      <Dropdown.Item
                        onClick={() => deleteDialogue(
                          {
                            variables: {
                              input: {
                                customerSlug: activeCustomer?.slug as string,
                                id: dialogue?.id,
                              },
                            },
                          },
                        )}
                      >
                        {t('delete')}
                      </Dropdown.Item>

                    </Dropdown.Content>
                  </Dropdown.Root>
                </UI.Div>
              )}
            </UI.Flex>
          </UI.Div>

          <UI.Flex justifyContent="space-between" alignItems="flex-end">
            <UI.Div style={{ marginTop: 'auto' }}>
              {!!dialogue.language && (
                <UI.Div mt="auto">
                  <UI.Label size="sm">
                    <UI.Flex alignItems="center">
                      <UI.Icon verticalAlign="middle" mt="4px">
                        {renderFlag(dialogue.language)}
                      </UI.Icon>
                      <UI.Span ml={1}>
                        <UI.Helper>
                          {t(`languages:${dialogue.language.toLowerCase()}`)}
                        </UI.Helper>
                      </UI.Span>
                    </UI.Flex>
                  </UI.Label>
                </UI.Div>
              )}

              <UI.Flex alignItems="center" mt={1} justifyContent="space-between">
                <UI.Div>
                  {lastUpdated && (
                    <UI.Text fontWeight={500} fontSize="0.75rem" color="off.500">
                      {t('last_updated', {
                        date: formatDistance(lastUpdated, new Date(), {
                          locale: getLocale(),
                        }),
                      })}
                    </UI.Text>
                  )}
                </UI.Div>
              </UI.Flex>
            </UI.Div>

            {dialogue.isPrivate && (
              <UI.Div>
                <Avatar brand="off" name={`${user?.firstName} ${user?.lastName}`} />
              </UI.Div>
            )}
          </UI.Flex>
        </UI.ColumnFlex>
      </UI.CardBody>
    </UI.NewCard>
  );
};

export default DialogueCard;
