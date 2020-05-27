import { useEffect, useRef } from 'react';
import { useHistory, useLocation, useParams } from 'react-router-dom';
import { useMutation } from '@apollo/react-hooks';

import uploadEntryMutation from '../mutations/UploadEntryMutation';
import useDialogueTree from '../providers/DialogueTreeProvider';

const useJourneyFinish = () => {
  const finishedRef = useRef(false);
  const {
    treeState: { historyStack },
  } = useDialogueTree();

  const [submitForm] = useMutation(uploadEntryMutation, {});
  const history = useHistory();
  const { dialogueId } = useParams();
  const location = useLocation();
  //  Only fires if a user arrives as a node with no more interaction (FinishNode and ShareNode)
  useEffect(() => {
    console.log('submitting');
    submitForm({
      variables: {
        uploadUserSessionInput: {
          dialogueId,
          entries: historyStack.map((nodeEntry) => {
            const { node, edge, ...data } = nodeEntry;

            return { ...data, nodeId: node.id, edgeId: edge?.id };
          }),
        },
      },
    });
  }, [historyStack, submitForm, history, location.pathname, dialogueId]);

  return { finishedRef };
};

export default useJourneyFinish;
