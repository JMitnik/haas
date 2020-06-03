import { useEffect, useRef, useState } from 'react';

import { useHistory } from 'react-router-dom';
import { useMutation } from '@apollo/react-hooks';
import uploadUserSessionMutation from 'mutations/UploadEntryMutation';
import useDialogueTree from 'providers/DialogueTreeProvider';
import useProject from 'providers/ProjectProvider';

const useJourneyFinish = () => {
  const [isFinished, setIsFinished] = useState(false);

  const store = useDialogueTree();
  const { dialogue } = useProject();
  const [uploadInteraction] = useMutation(uploadUserSessionMutation, {
    onError: (error) => {
      console.log('error', error.message);
    },
  });

  const entries = store.relevantSessionEntries;

  useEffect(() => {
    if (entries.length && !isFinished) {
      uploadInteraction({ variables: {
        uploadUserSessionInput: {
          dialogueId: dialogue?.id,
          entries: entries.map((entry) => ({
            nodeId: entry.node.node.id,
            edgeId: entry.edge?.id,
            data: entry.node?.data,
          })),
        },
      } });

      setIsFinished(true);
    }
  });

  return { isFinished };
};

export default useJourneyFinish;
