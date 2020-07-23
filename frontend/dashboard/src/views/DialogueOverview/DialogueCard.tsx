import { ApolloError } from 'apollo-client';
import { Edit, MapPin, Trash, User } from 'react-feather';
import { formatDistance } from 'date-fns';
import { useHistory, useParams } from 'react-router';
import { useMutation } from '@apollo/react-hooks';
import React from 'react';
import styled, { css } from 'styled-components/macro';

import { Card, CardBody, ColumnFlex, Div, ExtLink, Flex, H3, Paragraph } from '@haas/ui';
import { Menu, MenuHeader, MenuItem } from 'components/Menu/Menu';
import { deleteQuestionnaireMutation } from 'mutations/deleteQuestionnaire';
import ShowMoreButton from 'components/ShowMoreButton';
import SliderNodeIcon from 'components/Icons/SliderNodeIcon';
import getDialoguesOfCustomer from 'queries/getDialoguesOfCustomer';

interface DialogueCardOptionsOverlayProps {
  onDelete: () => void;
  onEdit: () => void;
}

const DialogueCardOptionsOverlay = ({ onDelete, onEdit }: DialogueCardOptionsOverlayProps) => (
  <Menu>
    <MenuHeader>Actions</MenuHeader>
    <MenuItem onClick={() => onDelete()}>
      <Trash />
      Delete
    </MenuItem>
    <MenuItem onClick={() => onEdit()}>
      <Edit />
      Edit
    </MenuItem>
  </Menu>
);

const DialogueCard = ({ dialogue }: { dialogue: any }) => {
  const history = useHistory();
  const { customerSlug } = useParams();

  // TODO: How to deal with refetching query when deleted card on a filtered view (fetch and update the current view somehow)
  const [deleteTopic] = useMutation(deleteQuestionnaireMutation, {
    refetchQueries: [{
      query: getDialoguesOfCustomer,
      variables: {
        customerSlug,
      },
    }],
    onError: (serverError: ApolloError) => {
      console.log(serverError);
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
            <H3 color="app.onWhite" mb={2} fontWeight={500}>
              {dialogue.title}
            </H3>
            <Paragraph fontSize="0.8rem" color="app.mutedOnWhite" fontWeight="100">

              {/* TODO: Sanitize */}
              <ExtLink to={`https://haas-client.netlify.app/${dialogue.customer.slug}/${dialogue.slug}`}>
                {`haas.live/${dialogue.customer.slug}/${dialogue.slug}`}
              </ExtLink>
            </Paragraph>
          </Div>

          <Div>
            <Flex mb={4} flex="100%">
              <Flex flexWrap="wrap" alignSelf="flex-end" marginTop="5px" flexDirection="row">
                {dialogue.tags.map((tag: any, index: number) => <Tag key={index} tag={tag} />)}
              </Flex>
            </Flex>
            <Flex alignItems="center" justifyContent="space-between">
              <Div>
                {lastUpdated && (
                <Paragraph fontSize="0.8rem" color="app.mutedOnWhite">
                  last updated
                  {' '}
                  {formatDistance(lastUpdated, new Date())}
                  {' '}
                  ago
                </Paragraph>
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
  <TagContainer>
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
