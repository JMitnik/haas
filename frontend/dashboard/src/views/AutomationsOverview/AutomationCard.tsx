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

import { ReactComponent as DEFlag } from 'assets/icons/flags/flag-de.svg';
import { ReactComponent as GBFlag } from 'assets/icons/flags/flag-gb.svg';
import { ReactComponent as NLFlag } from 'assets/icons/flags/flag-nl.svg';

import { AutomationModel, AutomationType } from 'types/generated-types';
import { deleteDialogueMutation } from 'mutations/deleteDialogue';
import ShowMoreButton from 'components/ShowMoreButton';
import getDialoguesOfCustomer from 'queries/getDialoguesOfCustomer';
import getLocale from 'utils/getLocale';
import useAuth from 'hooks/useAuth';

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
  const history = useHistory();
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

  const renderAccentBorderColor = (type: AutomationType) => {
    switch (type) {
      case AutomationType.Trigger:
        return '#7069FA';
      case AutomationType.Campaign:
        return '#2CB1BC';
      default:
        return '#AFB4C6';
    }
  };

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
      <UI.AccentBorder backgroundColor={renderAccentBorderColor(automation.type)} />
      <UI.CardBody flex="100%">
        <UI.ColumnFlex justifyContent="space-between" height="100%">
          <UI.Div>
            <UI.Flex justifyContent="space-between" alignItems="center">
              <UI.Text fontSize={isCompact ? '1.1rem' : '1.4rem'} color="app.onWhite" mb={2} fontWeight={500}>
                {automation.label}
              </UI.Text>
            </UI.Flex>
          </UI.Div>

          <UI.Div>
            {/* TODO: Add back for Automation Actions */}
            {/* {!!dialogue.language && (
              <UI.Div mb={1}>
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
            )} */}

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
      </UI.CardBody>
    </UI.Card>
  );
};

export default DialogueCard;
