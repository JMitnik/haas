import { Routes, Route } from 'react-router-dom';
import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router';

import { Dialogue, Workspace, SessionEventInput } from '../../types/core-types';
import { QuestionNodeRenderer } from '../QuestionNode/QuestionNodeRenderer';

interface DialogueRouterProps {
  dialogue: Dialogue;
  workspace: Workspace;
  onEventUpload: (events: SessionEventInput[]) => void;
}

export const DialogueRenderer = ({ dialogue }: { dialogue: Dialogue }) => {
  const { workspace: workspaceSlug, dialogue: dialogueSlug } = useParams();
  const rootNode = dialogue.rootQuestion;
  const navigate = useNavigate();
  const params = useParams();

  // TODO: THis leads to redirect being stuck going back (not good practice IMHO).
  // Originally done to ensure that Sessions are not recreated when user goes back to Slider (this leads to a new Sesssion)
  // By redirecting them, we ensure that the Session is not recreated (because the user does not land on the same page).
  // perhaps we should find a way to inform NextJS that the session should not be recreated based on some other parameter.
  useEffect(() => {
    navigate(`n/${rootNode.id}`);
  }, [workspaceSlug, dialogueSlug, rootNode, navigate]);

  return (
    <div></div>
  )
};


export const DialogueRoutes = ({ dialogue, workspace, onEventUpload }: DialogueRouterProps) => {
  return (
    <Routes>
      <Route path="/:workspace/:dialogue">
        <Route index element={<DialogueRenderer dialogue={dialogue} />} />
        <Route path="n/:nodeId" element={<QuestionNodeRenderer onEventUpload={onEventUpload} dialogue={dialogue} />} />
      </Route>
    </Routes>
  )
}
