import { ApolloError } from 'apollo-client';
import { Edit, Trash } from 'react-feather';
import { formatDistance } from 'date-fns';
import { useHistory, useParams } from 'react-router';
import { useMutation } from '@apollo/react-hooks';
import React from 'react';

import { Card, CardBody, ColumnFlex, Div, ExtLink, Flex, H3, Paragraph } from '@haas/ui';
import { Menu, MenuHeader, MenuItem } from 'components/Menu/Menu';
import { deleteQuestionnaireMutation } from 'mutations/deleteQuestionnaire';
import ShowMoreButton from 'components/ShowMoreButton';
import getQuestionnairesCustomerQuery from 'queries/getQuestionnairesCustomerQuery';

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

  const [deleteTopic] = useMutation(deleteQuestionnaireMutation, {
    refetchQueries: [{
      query: getQuestionnairesCustomerQuery,
      variables: {
        id: customerSlug,
      },
    }],
    onError: (serverError: ApolloError) => {
      console.log(serverError);
    },
  });

  const deleteDialogue = async (topicId: string) => {
    deleteTopic({
      variables: {
        id: topicId,
      },
    });
  };

  // TODO: Move this url to a constant or so
  const goToEditDialogue = (topicId: string) => {
    history.push(`/dashboard/b/${customerSlug}/t/${topicId}/edit`);
  };

  const lastUpdated = new Date(Number.parseInt(dialogue.updatedAt, 10)) || null;

  return (
    <Card bg="white" useFlex flexDirection="column" onClick={() => history.push(`/dashboard/b/${customerSlug}/d/${dialogue.slug}`)}>
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

          <Flex justifyContent="space-between">
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
                  onDelete={() => deleteDialogue(dialogue.id)}
                  onEdit={() => goToEditDialogue(dialogue.id)}
                />
              )}
            />
          </Flex>
        </ColumnFlex>
      </CardBody>
    </Card>
  );
};

export default DialogueCard;
