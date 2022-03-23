import * as UI from '@haas/ui';
import {
  Button, Popover, PopoverArrow, PopoverBody, PopoverCloseButton,
  PopoverContent, PopoverFooter, PopoverHeader, PopoverTrigger, useToast,
} from '@chakra-ui/react';
import { formatDistance } from 'date-fns';
import { useHistory, useParams } from 'react-router';
import { useMutation } from '@apollo/client';
import { useTranslation } from 'react-i18next';
import React, { useRef } from 'react';

import { ReactComponent as DEFlag } from 'assets/icons/flags/flag-de.svg';
import { ReactComponent as GBFlag } from 'assets/icons/flags/flag-gb.svg';
import { ReactComponent as NLFlag } from 'assets/icons/flags/flag-nl.svg';

import { deleteDialogueMutation } from 'mutations/deleteDialogue';
import ShowMoreButton from 'components/ShowMoreButton';
import getDialoguesOfCustomer from 'queries/getDialoguesOfCustomer';
import getLocale from 'utils/getLocale';
import useAuth from 'hooks/useAuth';

import { Tag } from './Tag';

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
                  colorScheme="red"
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

const DialogueCard = ({ dialogue, isCompact }: { dialogue: any, isCompact?: boolean }) => {
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
    <UI.Card
      ref={ref}
      data-cy="DialogueCard"
      bg="white"
      useFlex
      flexDirection="column"
      onClick={() => history.push(`/dashboard/b/${customerSlug}/d/${dialogue.slug}`)}
    >
      <UI.CardBody flex="100%">
        <UI.ColumnFlex justifyContent="space-between" height="100%">
          <UI.Div>
            <UI.Flex justifyContent="space-between" alignItems="center">
              <UI.Text fontSize={isCompact ? '1.1rem' : '1.4rem'} color="app.onWhite" mb={2} fontWeight={500}>
                {dialogue.title}
              </UI.Text>
            </UI.Flex>

            {!isCompact && (
              <UI.Paragraph fontSize="0.8rem" color="app.mutedOnWhite" fontWeight="100">
                <UI.ExtLink to={`https://client.haas.live/${dialogue.customer.slug}/${dialogue.slug}`}>
                  {`haas.live/${dialogue.customer.slug}/${dialogue.slug}`}
                </UI.ExtLink>
              </UI.Paragraph>
            )}
          </UI.Div>

          <UI.Div>
            {!isCompact && (
              <UI.Flex mb={4} flex="100%">
                <UI.Flex flexWrap="wrap" alignSelf="flex-end" marginTop="5px" flexDirection="row">
                  {dialogue.tags.map((tag: any, index: number) => <Tag key={index} tag={tag} />)}
                </UI.Flex>
              </UI.Flex>
            )}

            {!!dialogue.language && (
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
