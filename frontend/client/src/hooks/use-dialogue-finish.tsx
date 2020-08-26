import { useEffect, useState } from 'react';
import { useMutation } from '@apollo/react-hooks';

import createSessionMutation from 'mutations/createSessionMutation';
import useDialogueTree from 'providers/DialogueTreeProvider';

const useJourneyFinish = (submitInstant: boolean = true) => {
  const [isFinished, setIsFinished] = useState(false);
  const [willSubmit, setWillSubmit] = useState(submitInstant);
  const store = useDialogueTree();

  const [createSession] = useMutation(createSessionMutation, {
  });

  const entries = store.relevantSessionEntries;
  const { customer } = store;
  const dialogue = store.tree;

  // Effect for submitting
  useEffect(() => {
    if (entries.length && !isFinished && willSubmit) {
      createSession({ variables: {
        input: {
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
  }, [entries, isFinished, willSubmit, createSession, customer, dialogue]);

  // Effect for Post-submission
  useEffect(() => {
    if (isFinished) {
      store.session.reset();
    }
  }, [isFinished, store.session]);

  return { isFinished, setWillSubmit };
};

export default useJourneyFinish;
