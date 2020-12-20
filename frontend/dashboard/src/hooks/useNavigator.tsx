import { useParams, useRouteMatch } from 'react-router';

export const ROUTES = {
  WORKSPACE_ROOT: '/dashboard/b/:customerSlug',
  DIALOGUES_VIEW: '/dashboard/b/:customerSlug/d',
  DIALOGUE_ROOT: '/dashboard/b/:customerSlug/d/:dialogueSlug',
};

export const useNavigator = () => {
  const { customerSlug, dialogueSlug } = useParams<{ customerSlug: string, dialogueSlug: string }>();
  const dialogueMatch = useRouteMatch<{ dialogueSlug: string }>({
    path: ROUTES.DIALOGUE_ROOT,
  });

  const dialoguesMatch = useRouteMatch({
    path: ROUTES.DIALOGUES_VIEW,
  });

  return {
    dialoguesMatch,
    dialogueMatch,
    customerSlug,
    dialogueSlug,
  };
};
