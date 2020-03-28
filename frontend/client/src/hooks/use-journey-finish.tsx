import { useRef, useEffect } from 'react';
import { useMutation } from '@apollo/react-hooks';
import uploadEntryMutation from '../mutations/UploadEntryMutation';
import useHAASTree from './use-haas-tree';
import { useHistory, useLocation } from 'react-router-dom';

const useJourneyFinish = ({
  isLeaf = false,
  useFinishPage = false
}: {
  isLeaf?: boolean;
  useFinishPage: boolean;
}) => {
  const finishedRef = useRef(false);
  const {
    treeState: { historyStack }
  } = useHAASTree();
  const [submitForm] = useMutation(uploadEntryMutation, {});
  const history = useHistory();
  const location = useLocation();

  //  Only fires if current is set to true (which only happens)
  useEffect(() => {
    const finishJourney = () => {
      submitForm({
        variables: {
          uploadUserSessionInput: {
            entries: historyStack.map(nodeEntry => {
              const { node, edge, ...data } = nodeEntry;

              return { ...data, nodeId: node.id, edgeId: edge?.id };
            })
          }
        }
      }).then(() => {
        finishedRef.current = false;
        history.push(`${location.pathname}/finished`);
      });
    };

    if (finishedRef.current && isLeaf) {
      console.log('asdasd');
      finishJourney();
    }
  }, [historyStack, useFinishPage, isLeaf, submitForm, history, location.pathname]);

  return { finishedRef };
};

export default useJourneyFinish;
