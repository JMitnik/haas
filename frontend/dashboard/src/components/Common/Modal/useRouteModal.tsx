/* eslint-disable consistent-return */
import { generatePath, useHistory, useLocation, useRouteMatch } from 'react-router-dom';

import { useNavigator } from 'hooks/useNavigator';

interface UseRouteModal {
  matchUrlKey: string;
  exitUrl: string;
  exitCallback?: () => void;
}

type UseRouteModalOutput<T> = [
  open: (input: T) => void,
  close: () => void,
  isOpen: boolean,
  params: T,
];

export function useRouteModal<RouteParams>({
  matchUrlKey,
  exitUrl,
  exitCallback,
}: UseRouteModal): UseRouteModalOutput<RouteParams> {
  const { customerSlug, dialogueSlug } = useNavigator();
  const match = useRouteMatch<Record<string, string>>({
    path: matchUrlKey,
    exact: true,
  });
  const history = useHistory();
  const location = useLocation();

  const open = (input: RouteParams) => {
    history.push(generatePath(matchUrlKey, { ...input, customerSlug, dialogueSlug }) + location.search);
  };

  const close = () => {
    if (exitCallback) return exitCallback();
    history.push(exitUrl);
  };

  const isOpen = !!match;

  return [open, close, isOpen, match?.params as unknown as RouteParams];
}
