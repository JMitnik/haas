import * as UI from '@haas/ui';
import {
  Button, Popover, PopoverArrow, PopoverBody, PopoverCloseButton,
  PopoverContent, PopoverFooter, PopoverHeader, PopoverTrigger, useToast,
} from '@chakra-ui/core';
import { formatDistance } from 'date-fns';
import { useHistory, useParams } from 'react-router';
import { useMutation } from '@apollo/client';
import { useTranslation } from 'react-i18next';
import React, { useRef } from 'react';
import styled, { css } from 'styled-components';

import { ReactComponent as DEFlag } from 'assets/icons/flags/flag-de.svg';
import { ReactComponent as GBFlag } from 'assets/icons/flags/flag-gb.svg';
import { ReactComponent as NLFlag } from 'assets/icons/flags/flag-nl.svg';
import { deleteDialogueMutation } from 'mutations/deleteDialogue';
import { useCustomer } from 'providers/CustomerProvider';
import { useSetDialoguePrivacyMutation } from 'types/generated-types';
import { useUser } from 'providers/UserProvider';
import ShowMoreButton from 'components/ShowMoreButton';
import getDialoguesOfCustomer from 'queries/getDialoguesOfCustomer';
import getLocale from 'utils/getLocale';
import useAuth from 'hooks/useAuth';

interface DialogueCardOptionsOverlayProps {
  onDelete: (e: React.MouseEvent<HTMLElement>) => void;
  onEdit: (e: React.MouseEvent<HTMLElement>) => void;
  isPrivate: boolean;
  dialogueSlug: string;
}

const DialogueCardOptionsOverlay = ({ onDelete, onEdit, isPrivate, dialogueSlug }: DialogueCardOptionsOverlayProps) => {
  const { t } = useTranslation();
  const { activeCustomer } = useCustomer();
  const { canAssignUsersToDialogue } = useAuth();
  const toast = useToast();

  const [setDialoguePrivacy] = useSetDialoguePrivacyMutation({
    variables: {
      input: {
        dialogueSlug,
        customerId: activeCustomer?.id as string,
        state: !isPrivate,
      },
    },
    refetchQueries: [{
      query: getDialoguesOfCustomer,
      variables: {
        customerSlug: activeCustomer?.slug as string,
      },
    }],
    onCompleted: (data) => {
      const state = data.setDialoguePrivacy?.isPrivate ? 'private' : 'public';
      toast({
        title: 'Dialogue privacy change',
        description: `The dialogue privacy settings have been changed to ${state}.`,
        status: 'success',
        position: 'bottom-right',
        duration: 1500,
      });
    },
    onError: () => {
      toast({
        title: 'Something went wrong!',
        description: 'The dialogue privacy settings were not changed.',
        status: 'error',
        position: 'bottom-right',
        duration: 1500,
      });
    },
  });

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
      {canAssignUsersToDialogue && (
        <UI.ListItem onClick={() => setDialoguePrivacy()}>
          {t(`make_dialogue_${isPrivate ? 'public' : 'private'}`)}
        </UI.ListItem>
      )}

    </UI.List>
  );
};

const DialogueCardContainer = styled(UI.Div)`
  ${({ theme }) => css`
    background: white;
    box-shadow: ${theme.boxShadows.md};
    border-radius: ${theme.borderRadiuses.md}px;
    transition: all ${theme.transitions.normal};

    &:hover {
      box-shadow: ${theme.boxShadows.lg};
      cursor: pointer;
      transition: all ${theme.transitions.normal};
    }
  `}
`;

const DialogueCard = ({ dialogue, isCompact }: { dialogue: any, isCompact?: boolean }) => {
  const history = useHistory();
  const { user } = useUser();
  const { customerSlug } = useParams<{ customerSlug: string }>();
  const { canAccessAdmin } = useAuth();
  const ref = useRef(null);
  const { t } = useTranslation();
  const toast = useToast();

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
          id: dialogue.id,
          customerSlug,
        },
      },
    });
  };

  // TODO: Move this url to a constant or so
  const goToEditDialogue = (e: React.MouseEvent<HTMLElement>) => {
    e.stopPropagation();
    history.push(`/dashboard/b/${customerSlug}/d/${dialogue.slug}/edit`);
  };

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

  return (
    <DialogueCardContainer
      ref={ref}
      data-cy="DialogueCard"
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

              <UI.Div ml={2}>
                {canAccessAdmin && (
                  <ShowMoreButton
                    renderMenu={(
                      <DialogueCardOptionsOverlay
                        dialogueSlug={dialogue.slug}
                        isPrivate={dialogue.isPrivate}
                        onDelete={handleDeleteDialogue}
                        onEdit={goToEditDialogue}
                      />
                    )}
                  />
                )}
              </UI.Div>
            </UI.Flex>
          </UI.Div>

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
            </UI.Flex>
          </UI.Div>
        </UI.ColumnFlex>
        {/*
      {dialogue.isPrivate && (
        <UI.Div position="absolute" right="5px" top="5px">
          <ChakraAvatar bg="gray.300" size="xs" name={`${user?.firstName} ${user?.lastName}`} />
        </UI.Div>
      )} */}
      </UI.CardBody>
    </DialogueCardContainer>
  );
};

export default DialogueCard;
