import * as Dropdown from 'components/Common/Dropdown';
import * as UI from '@haas/ui';
import {
  CheckIcon,
  ChevronRightIcon,
  Cross1Icon,
  LockClosedIcon,
  LockOpen2Icon,
  Pencil1Icon,
} from '@radix-ui/react-icons';
import { formatDistance } from 'date-fns';
import { useHistory } from 'react-router';
import { useTranslation } from 'react-i18next';
import React, { useContext, useRef, useState } from 'react';

import * as ContextMenu from 'components/Common/ContextMenu';
import { ReactComponent as DEFlag } from 'assets/icons/flags/flag-de.svg';
import {
  Dialogue,
  UserType,
  useAssignUserToDialogueMutation,
  useDeleteDialogueMutation,
  useSetDialoguePrivacyMutation,
} from 'types/generated-types';
import { ReactComponent as GBFlag } from 'assets/icons/flags/flag-gb.svg';
import { ReactComponent as NLFlag } from 'assets/icons/flags/flag-nl.svg';
import { ShowMoreButton } from 'components/Common/ShowMoreButton';
import { ThemeContext } from 'styled-components';
import { useCustomer } from 'providers/CustomerProvider';
import { useNavigator } from 'hooks/useNavigator';
import { useToast } from 'hooks/useToast';
import getLocale from 'utils/getLocale';
import useAuth from 'hooks/useAuth';

import { AssigneeAvatar } from './AssigneeAvatar';

interface DialogueCardProps {
  dialogue: Dialogue;
  users: UserType[];
}

const DialogueCard = ({ dialogue, users }: DialogueCardProps) => {
  const themeContext = useContext(ThemeContext);
  const history = useHistory();
  const { activeCustomer } = useCustomer();
  const { customerSlug } = useNavigator();
  const { canAccessAdmin, canDeleteDialogue, canEditDialogue, canAssignUsersToDialogue } = useAuth();
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

  const [assignDialogueToUser] = useAssignUserToDialogueMutation({
    onError: (serverError: any) => {
      console.log(serverError);
    },
    refetchQueries: ['dialogueConnection'],
  });

  const [deleteDialogue] = useDeleteDialogueMutation({
    onCompleted: () => {
      toast.success({
        title: t('delete_dialogue_complete'),
        description: t('delete_dialogue_complete_helper'),
      });
    },
    variables: {
      input: {
        customerSlug,
        id: dialogue.id,
      },
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
    <UI.Div>
      <ContextMenu.Root>
        <ContextMenu.Trigger>
          <UI.Card
            ref={ref}
            data-cy="DialogueCard"
            hasHover
            bg="white"
            onClick={() => history.push(`/dashboard/b/${customerSlug}/d/${dialogue.slug}`)}
            height="100%"
          >
            <UI.CardBody height="100%" flex="100%">
              <UI.ColumnFlex justifyContent="space-between" height="100%">
                <UI.Div>
                  <UI.Flex justifyContent="space-between">
                    <UI.Div style={{ wordBreak: 'break-all' }}>
                      <UI.H4 color="off.600" fontWeight="700">
                        {dialogue.title}
                      </UI.H4>
                      <UI.ExtLink to={`https://client.haas.live/${dialogue?.customer?.slug}/${dialogue.slug}`} color="off.300">
                        {`${dialogue.customer?.slug}/${dialogue.slug}`}
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

                            <Dropdown.CheckedItem
                              isChecked={dialogue?.isPrivate || false}
                              onClick={() => setDialoguePrivacy()}
                            >
                              {t('set_private')}
                            </Dropdown.CheckedItem>

                            <UI.Hr />

                            <Dropdown.Item
                              onClick={() => deleteDialogue()}
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
                    <UI.Flex>
                      <UI.Div mt="auto" mr={2}>
                        <UI.Label size="sm">
                          <UI.Flex height="25px" alignItems="center">
                            <UI.Icon color={themeContext.colors.gray[500]} verticalAlign="middle">
                              {dialogue.isPrivate ? <LockClosedIcon /> : <LockOpen2Icon />}
                            </UI.Icon>
                            <UI.Span ml={1}>
                              <UI.Helper>
                                {dialogue.isPrivate ? 'Private' : 'Public'}
                              </UI.Helper>
                            </UI.Span>
                          </UI.Flex>
                        </UI.Label>
                      </UI.Div>
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
                    </UI.Flex>

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

                  <UI.Flex flexDirection="row-reverse">
                    {dialogue.assignees?.map((assignee, index) => (
                      <AssigneeAvatar assignee={assignee as UserType} index={index} />
                    ))}
                  </UI.Flex>

                </UI.Flex>
              </UI.ColumnFlex>
            </UI.CardBody>
          </UI.Card>
        </ContextMenu.Trigger>
        <ContextMenu.Content sideOffset={5} align="end">
          <ContextMenu.Item
            onClick={() => history.push(`/dashboard/b/${customerSlug}/d/${dialogue.slug}/edit`)}
            disabled={!canEditDialogue}
          >
            {t('edit')}
            <ContextMenu.RightSlot>
              <Pencil1Icon />
            </ContextMenu.RightSlot>
          </ContextMenu.Item>
          <ContextMenu.Sub>
            <ContextMenu.SubTrigger>
              Assign to...
              <ContextMenu.RightSlot>
                <ChevronRightIcon />
              </ContextMenu.RightSlot>
            </ContextMenu.SubTrigger>
            <ContextMenu.SubContent sideOffset={2} alignOffset={-5}>
              {users?.map((user) => {
                const isAssignedToDialogue = !!dialogue.assignees?.find((assignee) => assignee?.id === user.id);
                return (
                  <ContextMenu.CheckboxItem
                    disabled={!canAssignUsersToDialogue}
                    checked={isAssignedToDialogue}
                    onCheckedChange={() => assignDialogueToUser(
                      {
                        variables: {
                          input: {
                            dialogueId: dialogue.id,
                            state: !isAssignedToDialogue,
                            userId: user.id,
                            workspaceId: activeCustomer?.id as string,
                          },
                        },
                      },
                    )}
                    onSelect={(e) => e.preventDefault()}
                  >
                    <ContextMenu.ItemIndicator>
                      <UI.Icon marginRight={1}>
                        <CheckIcon />
                      </UI.Icon>
                    </ContextMenu.ItemIndicator>
                    <UI.Span>
                      {user.firstName}
                      {' '}
                      {user.lastName}
                    </UI.Span>
                  </ContextMenu.CheckboxItem>
                );
              })}
            </ContextMenu.SubContent>
          </ContextMenu.Sub>
          <ContextMenu.Separator />
          <ContextMenu.CheckboxItem
            disabled={!canEditDialogue}
            checked={dialogue?.isPrivate || undefined}
            onCheckedChange={() => setDialoguePrivacy()}
          >
            <ContextMenu.ItemIndicator>
              <UI.Icon marginRight={1}>
                <CheckIcon />
              </UI.Icon>
            </ContextMenu.ItemIndicator>
            <UI.Span>
              Only assignees can access
            </UI.Span>
          </ContextMenu.CheckboxItem>
          <ContextMenu.Separator />
          <ContextMenu.Item onClick={() => deleteDialogue()} disabled={!canDeleteDialogue}>
            {t('delete')}
            <ContextMenu.RightSlot>
              <Cross1Icon />
            </ContextMenu.RightSlot>
          </ContextMenu.Item>
        </ContextMenu.Content>
      </ContextMenu.Root>
    </UI.Div>
  );
};

export default DialogueCard;
