export const useFormatter = () => ({
  formatScore: (score: number | undefined) => {
    if (!score) return ' ';

    return (score / 10).toFixed(1);
  },
});
