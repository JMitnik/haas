import { useDialogueState } from 'modules/Dialogue/DialogueState';
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';

/**
 * Tracks if the dialogue is finished, and shows the user a Modal if they went back.
 *
 * Scope: Dialogue.tsx
 */
export const useTrackFinished = () => {
  const { nodeId } = useParams<{ nodeId: string }>();

  const { isFinished, terminalNodeId } = useDialogueState((state) => ({
    isFinished: state.isFinished,
    terminalNodeId: state.terminalNodeId,
  }));

  useEffect(() => {
    // If we finished, but are not at the terminal node any longer, show Modal to inform user of this.
    if (isFinished && nodeId !== terminalNodeId) {
      console.log('finished');
    }

    // If we're at the terminal node, close the modal
    if (isFinished && nodeId === terminalNodeId) {
      console.log('not finished');
    }
  }, [isFinished, terminalNodeId]);
};
