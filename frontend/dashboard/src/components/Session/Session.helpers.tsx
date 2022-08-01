import { isPresent } from 'ts-is-present';

import { Session } from './Session.types';

export const getChoiceNodeValues = (session: Session): string[] => (
  session?.nodeEntries?.map((nodeEntry) => nodeEntry.value?.choiceNodeEntry).filter(isPresent)
) || [];

export const getMainTopicValue = (session: Session): string | null => {
  const nodeValues = getChoiceNodeValues(session);

  return nodeValues.length > 0 ? nodeValues[0] : null;
};
