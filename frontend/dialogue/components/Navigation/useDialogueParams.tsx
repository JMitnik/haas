import { useParams } from 'react-router-dom';

interface DialogueParams {
  workspace: string;
  dialogue: string;
  nodeId: string;
}

/**
 * Returns the possible params of the dialogue.
 */
export const useDialogueParams = (): DialogueParams => {
  const { workspace, dialogue, nodeId } = useParams();

  return {
    workspace,
    dialogue,
    nodeId,
  }
};
