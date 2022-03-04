import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router';

import { Dialogue } from '../../types/core-types';


export const FallbackRouter = ({ dialogue }: { dialogue: Dialogue }) => {
  const { workspace: workspaceSlug, dialogue: dialogueSlug } = useParams();
  const rootNode = dialogue.rootQuestion;
  const navigate = useNavigate();

  // TODO: THis leads to redirect being stuck going back (not good practice IMHO).
  // Originally done to ensure that Sessions are not recreated when user goes back to Slider (this leads to a new Sesssion)
  // By redirecting them, we ensure that the Session is not recreated (because the user does not land on the same page).
  // perhaps we should find a way to inform NextJS that the session should not be recreated based on some other parameter.
  useEffect(() => {
    navigate(`n/${rootNode.id}`);
  }, [workspaceSlug, dialogueSlug, rootNode, navigate]);

  return (
    <div></div>
  );
};
