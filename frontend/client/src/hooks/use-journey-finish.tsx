import { useRef, useEffect } from 'react';
import { useMutation } from '@apollo/react-hooks';
import uploadEntryMutation from '../mutations/UploadEntryMutation';
import useHAASTree from './use-haas-tree';
import { useHistory, useLocation } from 'react-router-dom';

const useJourneyFinish = () => {
  const finishedRef = useRef(false);
  const {
    treeState: { historyStack }
  } = useHAASTree();

  const [submitForm] = useMutation(uploadEntryMutation, {});
  const history = useHistory();
  const location = useLocation();

  //  Only fires if current is set to true (which only happens)
  useEffect(() => {
    console.log('submitting');
    submitForm({
      variables: {
        uploadUserSessionInput: {
          entries: historyStack.map(nodeEntry => {
            const { node, edge, ...data } = nodeEntry;

            return { ...data, nodeId: node.id, edgeId: edge?.id };
          })
        }
      }
    });
  }, [historyStack, submitForm, history, location.pathname]);

  return { finishedRef };
};

export default useJourneyFinish;
