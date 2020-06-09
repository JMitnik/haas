import { useEffect, useState } from 'react';

import { useMutation } from '@apollo/react-hooks';
import uploadUserSessionMutation from 'mutations/UploadEntryMutation';
import useDialogueTree from 'providers/DialogueTreeProvider';

const useJourneyFinish = (submitInstant: boolean = true) => {
  const [isFinished, setIsFinished] = useState(false);
  const [willSubmit, setWillSubmit] = useState(submitInstant);
  const store = useDialogueTree();

  const [uploadInteraction] = useMutation(uploadUserSessionMutation, {
    onError: (error) => {
      console.log('error', error.message);
    },
  });

  const entries = store.relevantSessionEntries;
  const { customer } = store;
  const dialogue = store.tree;

  // Effect for submitting
  useEffect(() => {
    if (entries.length && !isFinished && willSubmit) {
      uploadInteraction({ variables: {
        uploadUserSessionInput: {
          dialogueId: dialogue?.id,
          entries: entries.map((entry) => ({
            nodeId: entry.node.node.id,
            edgeId: entry.edge?.id,
            depth: entry.depth,
            data: entry.node?.data,
          })),
        },
      } });

      setIsFinished(true);
    }
  }, [entries, isFinished, willSubmit, uploadInteraction, customer, dialogue]);

  // Effect for Post-submission
  useEffect(() => {
    if (isFinished) {
      store.session.reset();
    }
  }, [isFinished, store.session]);

  return { isFinished, setWillSubmit };
};

export default useJourneyFinish;
