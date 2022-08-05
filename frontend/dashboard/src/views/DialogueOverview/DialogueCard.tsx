import * as Dropdown from 'components/Common/Dropdown';
import * as UI from '@haas/ui';
import { formatDistance } from 'date-fns';
import { useHistory } from 'react-router';
import { useTranslation } from 'react-i18next';
import React, { useRef, useState } from 'react';

import * as Menu from 'components/Common/Menu';
import { Avatar } from 'components/Common/Avatar';
import { ReactComponent as DEFlag } from 'assets/icons/flags/flag-de.svg';
import {
  Dialogue,
  useDeleteDialogueMutation,
  useSetDialoguePrivacyMutation,
} from 'types/generated-types';
import { Filter, User } from 'react-feather';
import { ReactComponent as GBFlag } from 'assets/icons/flags/flag-gb.svg';
import { ReactComponent as NLFlag } from 'assets/icons/flags/flag-nl.svg';
import { ShowMoreButton } from 'components/Common/ShowMoreButton';
import { useCustomer } from 'providers/CustomerProvider';
import { useMenu } from 'components/Common/Menu/useMenu';
import { useNavigator } from 'hooks/useNavigator';
import { useToast } from 'hooks/useToast';
import { useUser } from 'providers/UserProvider';
import getLocale from 'utils/getLocale';
import useAuth from 'hooks/useAuth';

const DialogueCard = ({ dialogue }: { dialogue: Dialogue }) => {
  const history = useHistory();
  const { user } = useUser();
  const { activeCustomer } = useCustomer();
  const { customerSlug } = useNavigator();
  const { canAccessAdmin } = useAuth();
  const ref = useRef(null);
  const { t } = useTranslation();
  const toast = useToast();
  const { menuProps, openMenu, closeMenu, activeItem: contextInteraction } = useMenu<Dialogue>();

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
    <UI.Card
      ref={ref}
      data-cy="DialogueCard"
      hasHover
      bg="white"
      onClick={() => history.push(`/dashboard/b/${customerSlug}/d/${dialogue.slug}`)}
      onContextMenu={(e) => openMenu(e, dialogue)}
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
      <Menu.Base
        {...menuProps}
        onClose={closeMenu}
      >
        <Menu.Header>
          <UI.Icon>
            <Filter />
          </UI.Icon>
          {t('dialogue')}
        </Menu.Header>
        <Menu.Item
          onClick={
            () => null
          }
        >
          {t('edit')}
        </Menu.Item>
        <Menu.Item
          onClick={
            () => null
          }
        >
          {t('delete')}
        </Menu.Item>
        <Menu.SubMenu label={(
          <UI.Flex>
            <UI.Icon mr={1} width={10}>
              <User />
            </UI.Icon>
            {t('Accessibility')}
          </UI.Flex>
        )}
        >
          <Menu.Item
            onClick={
              () => null
            }
          >
            {t('set_private')}
          </Menu.Item>
          <Menu.SubMenu label={(
            <UI.Flex>
              <UI.Icon mr={1} width={10}>
                <User />
              </UI.Icon>
              {t('assign_to')}
            </UI.Flex>
          )}
          >
            <Menu.Item
              onClick={
                () => null
              }
            >
              Persoon 1
            </Menu.Item>
            <Menu.Item
              onClick={
                () => null
              }
            >
              Persoon 2
            </Menu.Item>
          </Menu.SubMenu>
          <Menu.Item
            onClick={
              () => null
            }
          >
            Show all from this team
          </Menu.Item>
        </Menu.SubMenu>
      </Menu.Base>
    </UI.Card>
  );
};

export default DialogueCard;
