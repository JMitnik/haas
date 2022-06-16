import { GREEN_LOWER_BOUND, ORANGE_LOWER_BOUND } from 'config/constants';

export type ScoreContainerState = 'gray' | 'green' | 'orange' | 'red';

export const getColorScoreState = (score?: number) => {
  if (!score) return 'gray';

  if (score >= GREEN_LOWER_BOUND) return 'green';
  if (score < GREEN_LOWER_BOUND && score >= ORANGE_LOWER_BOUND) return 'orange';

  return 'red';
};
