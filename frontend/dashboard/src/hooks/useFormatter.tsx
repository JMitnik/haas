export const useFormatter = () => ({
  formatScore: (score: number | undefined) => {
    if (!score) return '0';

    return (score / 10).toFixed(1);
  },
  formatFractionToPercentage: (fraction: number) => `${(fraction * 100).toFixed(1)}%`,
});
