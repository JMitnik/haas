import { useHistory } from 'react-router-dom';

const useEdgeTransition = () => {
  const history = useHistory();

  const goToEdge = (companySlug: string, dialogueId: string, edgeId: string) => history.push(`/${companySlug}/${dialogueId}/${edgeId}`);

  return {
    goToEdge,
  };
};

export default useEdgeTransition;
