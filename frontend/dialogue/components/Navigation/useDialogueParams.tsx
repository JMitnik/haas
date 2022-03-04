import { useParams, useSearchParams } from 'react-router-dom';

interface DialogueParams {
  workspace: string;
  dialogue: string;
  nodeId: string;
  fromNode?: string;
  fromEdge?: string;
}

/**
 * Returns the possible params of the dialogue.
 */
export const useDialogueParams = (): DialogueParams => {
  const { workspace, dialogue, nodeId } = useParams();
  const [searchParams] = useSearchParams();
  const fromNode = searchParams.get('fromN');
  const fromEdge = searchParams.get('fromE');

  return {
    workspace,
    dialogue,
    nodeId,
    fromNode,
    fromEdge,
  }
};
