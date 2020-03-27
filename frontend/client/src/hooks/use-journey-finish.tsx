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
  const { entryHistoryStack } = useHAASTree();
  const [submitForm] = useMutation(uploadEntryMutation, {});
  const history = useHistory();
  const location = useLocation();

  //  Only fires if current is set to true (which only happens)
  useEffect(() => {
    const finishJourney = () => {
      submitForm({
        variables: {
          uploadUserSessionInput: { entries: entryHistoryStack }
        }
      }).then(
        () => useFinishPage && history.push(`${location.pathname}/finished`)
      );
    };

    if (finishedRef.current && isLeaf) {
      finishJourney();
    }
  }, [
    entryHistoryStack,
    useFinishPage,
    isLeaf,
    submitForm,
    history,
    location.pathname
  ]);

  return { finishedRef };
};

export default useJourneyFinish;
