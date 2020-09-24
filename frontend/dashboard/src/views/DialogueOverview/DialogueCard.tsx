import { ApolloError } from 'apollo-client';
import { Edit, MapPin, Trash, User } from 'react-feather';
import { formatDistance } from 'date-fns';

import { useHistory, useParams } from 'react-router';
import { useMutation } from '@apollo/react-hooks';
import React from 'react';
import styled, { css } from 'styled-components/macro';

import { Card, CardBody, ColumnFlex, Div, ExtLink, Flex, Paragraph, Text } from '@haas/ui';
import { Menu, MenuHeader, MenuItem } from 'components/Menu/Menu';
import { deleteQuestionnaireMutation } from 'mutations/deleteQuestionnaire';
import { useToast } from '@chakra-ui/core';
import { useTranslation } from 'react-i18next';
import ShowMoreButton from 'components/ShowMoreButton';
import SliderNodeIcon from 'components/Icons/SliderNodeIcon';
import getDialoguesOfCustomer from 'queries/getDialoguesOfCustomer';
import getLocale from 'utils/getLocale';

interface DialogueCardOptionsOverlayProps {
  onDelete: () => void;
  onEdit: () => void;
}

const DialogueCardOptionsOverlay = ({ onDelete, onEdit }: DialogueCardOptionsOverlayProps) => {
  const { t } = useTranslation();

  return (
    <Menu>
      <MenuHeader>{t('actions')}</MenuHeader>
      <MenuItem onClick={() => onDelete()}>
        <Trash />
        {t('delete')}
      </MenuItem>
      <MenuItem onClick={() => onEdit()}>
        <Edit />
        {t('edit')}
      </MenuItem>
    </Menu>
  );
};

const DialogueCard = ({ dialogue, isCompact }: { dialogue: any, isCompact?: boolean }) => {
  const history = useHistory();
  const { customerSlug } = useParams();
  const { t } = useTranslation();
  const toast = useToast();

  // TODO: How to deal with refetching query when deleted card on a filtered view (fetch and update the current view somehow   )
  const [deleteTopic] = useMutation(deleteQuestionnaireMutation, {
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

  const deleteDialogue = async () => {
    deleteTopic({
      variables: {
        id: dialogue.id,
      },
    });
  };

  // TODO: Move this url to a constant or so
  const goToEditDialogue = () => {
    history.push(`/dashboard/b/${customerSlug}/d/${dialogue.slug}/edit`);
  };

  const lastUpdated = dialogue.updatedAt ? new Date(Number.parseInt(dialogue.updatedAt, 10)) : null;

  return (
    <Card data-cy="DialogueCard" bg="white" useFlex flexDirection="column" onClick={() => history.push(`/dashboard/b/${customerSlug}/d/${dialogue.slug}`)}>
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
              <ShowMoreButton
                renderMenu={(
                  <DialogueCardOptionsOverlay
                    onDelete={() => deleteDialogue()}
                    onEdit={() => goToEditDialogue()}
                  />
              )}
              />
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
