import { useRef, useEffect } from 'react';
import { useMutation } from '@apollo/react-hooks';
import uploadEntryMutation from '../mutations/UploadEntryMutation';
import useHAASTree from './use-haas-tree';
import { useHistory, useLocation, useParams } from 'react-router-dom';

const useJourneyFinish = () => {
  const finishedRef = useRef(false);
  const {
    treeState: { historyStack }
  } = useHAASTree();

  const [submitForm] = useMutation(uploadEntryMutation, {});
  const history = useHistory();
  const { questionnaireId } = useParams();
  const location = useLocation();
  //  Only fires if a user arrives as a node with no more interaction (FinishNode and ShareNode)
  useEffect(() => {
    console.log('submitting');
    submitForm({
      variables: {
        uploadUserSessionInput: {
          questionnaireId,
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
