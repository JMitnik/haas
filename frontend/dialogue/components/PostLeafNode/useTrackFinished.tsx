import { useEffect } from 'react';
import { useParams } from 'react-router-dom';

import { useDialogueStore } from '../Dialogue/DialogueStore';
import { usePostLeafModal } from './PostLeafModal';

/**
 * Tracks if the dialogue is finished, and shows the user a Modal if they went back.
 *
 * Scope: Dialogue.tsx
 */
export const useTrackFinished = () => {
  const isFinished = useDialogueStore(state => state.isFinished);
  const terminalNodeId = useDialogueStore(state => state.terminalNodeId);
  const { nodeId } = useParams();
  const [openPostLeafModal, closePostLeafModal] = usePostLeafModal();

  useEffect(() => {
    // If we finished, but are not at the terminal node any longer, show Modal to inform user of this.
    if (isFinished && nodeId !== terminalNodeId) {
      openPostLeafModal();
    }

    // If we're at the terminal node, close the modal
    if (isFinished && nodeId === terminalNodeId) {
      closePostLeafModal();
    }
  }, [isFinished, openPostLeafModal, closePostLeafModal, nodeId, terminalNodeId])
}
