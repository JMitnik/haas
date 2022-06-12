export type ScoreContainerState = 'gray' | 'green' | 'orange' | 'red';

export const getColorScoreState = (score?: number) => {
  if (!score) return 'gray';

  if (score >= 76) return 'green';
  if (score <= 75 && score >= 51) return 'orange';

  return 'red';
};
