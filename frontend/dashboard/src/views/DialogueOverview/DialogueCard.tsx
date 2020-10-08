import { Edit, MapPin, Trash, User } from 'react-feather';
import { formatDistance } from 'date-fns';

import { useHistory, useParams } from 'react-router';
import { useMutation } from '@apollo/react-hooks';
import React, { useRef } from 'react';
import styled, { css } from 'styled-components/macro';

import { Button, Popover, PopoverArrow, PopoverBody, PopoverCloseButton,
  PopoverContent, PopoverFooter, PopoverHeader, PopoverTrigger, useToast } from '@chakra-ui/core';
import { Card, CardBody, ColumnFlex, Div, ExtLink, Flex, Paragraph, Text } from '@haas/ui';
import { deleteDialogueMutation } from 'mutations/deleteDialogue';
import { useTranslation } from 'react-i18next';
import List from 'components/List/List';
import ListItem from 'components/List/ListItem';
import ShowMoreButton from 'components/ShowMoreButton';
import SliderNodeIcon from 'components/Icons/SliderNodeIcon';
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
    <List>
      <Popover>
        {() => (
          <>
            <PopoverTrigger>
              <ListItem renderLeftIcon={<Trash />}>
                {t('delete')}
              </ListItem>
            </PopoverTrigger>
            <PopoverContent zIndex={4}>
              <PopoverArrow />
              <PopoverHeader>{t('delete')}</PopoverHeader>
              <PopoverCloseButton />
              <PopoverBody>
                <Text>{t('delete_dialogue_popover')}</Text>
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
      <ListItem renderLeftIcon={<Edit />} onClick={onEdit}>
        {t('edit')}
      </ListItem>
    </List>
  );
};

const DialogueCard = ({ dialogue, isCompact }: { dialogue: any, isCompact?: boolean }) => {
  const history = useHistory();
  const { customerSlug } = useParams<{ customerSlug: string }>();
  const { canAccessAdmin } = useAuth();
  const ref = useRef(null);
  const { t } = useTranslation();
  const toast = useToast();

  // TODO: How to deal with refetching query when deleted card on a filtered view (fetch and update the current view somehow   )
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

  const lastUpdated = dialogue.updatedAt ? new Date(Number.parseInt(dialogue.updatedAt, 10)) : null;

  return (
    <Card
      ref={ref}
      data-cy="DialogueCard"
      bg="white"
      useFlex
      flexDirection="column"
      onClick={() => history.push(`/dashboard/b/${customerSlug}/d/${dialogue.slug}`)}
    >
      <CardBody flex="100%">
        <ColumnFlex justifyContent="space-between" height="100%">
          <Div>
            <Text fontSize={isCompact ? '1.1rem' : '1.4rem'} color="app.onWhite" mb={2} fontWeight={500}>
              {dialogue.title}
            </Text>

            {!isCompact && (
              <Paragraph fontSize="0.8rem" color="app.mutedOnWhite" fontWeight="100">
                <ExtLink to={`https://haas-client.netlify.app/${dialogue.customer.slug}/${dialogue.slug}`}>
                  {`haas.live/${dialogue.customer.slug}/${dialogue.slug}`}
                </ExtLink>
              </Paragraph>
            )}
          </Div>

          <Div>
            {!isCompact && (
              <Flex mb={4} flex="100%">
                <Flex flexWrap="wrap" alignSelf="flex-end" marginTop="5px" flexDirection="row">
                  {dialogue.tags.map((tag: any, index: number) => <Tag key={index} tag={tag} />)}
                </Flex>
              </Flex>
            )}

            <Flex alignItems="center" justifyContent="space-between">
              <Div>
                {lastUpdated && (
                  <Text fontSize="0.7rem" color="gray.300">
                    {t('last_updated', { date: formatDistance(lastUpdated, new Date(), {
                      locale: getLocale(),
                    }) })}
                  </Text>
                )}
              </Div>
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
            </Flex>
          </Div>
        </ColumnFlex>
      </CardBody>
    </Card>
  );
};

interface TagProps {
  name: string;
  type: string;
}

const TagContainer = styled(Flex)`
  ${({ theme }) => css`
    border: 1px solid ${theme.colors.app.mutedOnDefault};
    padding: 4px 10px;
    font-size: 0.8rem;
    color: ${theme.colors.app.onDefault};
    background: ${theme.colors.default.normal};
    border-radius: 8px;
    align-items: center;
    margin-right: 5px;

    svg {
      stroke: ${theme.colors.app.mutedAltOnDefault};
      width: 18px;
    }
  `}
`;

const Tag = ({ tag }: { tag: TagProps }) => (
  <TagContainer data-cy="TagLabel">
    {tag.type === 'LOCATION' && (
      <MapPin />
    )}

    {tag.type === 'AGENT' && (
      <User />
    )}

    {tag.type === 'DEFAULT' && (
      <SliderNodeIcon color="black" />
    )}

    <Div marginLeft="2px">{tag.name}</Div>
  </TagContainer>
);

export default DialogueCard;
