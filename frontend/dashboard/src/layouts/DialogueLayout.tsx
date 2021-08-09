import React, { useEffect } from 'react';

import { ViewContainer } from '@haas/ui';
import { gql, useQuery } from '@apollo/client';
import { useDialogue } from 'providers/DialogueProvider';
import { useParams } from 'react-router';

interface DialogueLayoutProps {
  children: React.ReactNode;
}

const getSharedDialogueLayoutQuery = gql`
  query sharedDialogueLayoutProps($customerSlug: String!, $dialogueSlug: String!) {
    customer(slug: $customerSlug) {
      id
      dialogue(where: { slug: $dialogueSlug }) {
        id
        title
        tags {
          type
        }
      }
    }
  }
`;

const DialogueLayout = ({ children }: DialogueLayoutProps) => {
  const { customerSlug, dialogueSlug } = useParams<{ customerSlug: string, dialogueSlug: string }>();
  const { setActiveDialogue } = useDialogue();

  const { data } = useQuery(getSharedDialogueLayoutQuery, {
    variables: {
      customerSlug,
      dialogueSlug,
    },
  });

  useEffect(() => {
    if (data) {
      setActiveDialogue(data?.customer?.dialogue);
    }

    return (() => setActiveDialogue(null));
  }, [data, setActiveDialogue]);

  return (
    <>
      <ViewContainer>
        {children}
      </ViewContainer>
    </>
  );
};

export default DialogueLayout;
