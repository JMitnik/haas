export type ScoreContainerState = 'gray' | 'green' | 'orange' | 'red';

export const getColorScoreState = (score?: number) => {
  if (!score) return 'gray';

  if (score >= 40) return 'green';
  if (score <= 70 && score >= 50) return 'orange';

  return 'red';
};
