export const useFormatter = () => ({
  formatScore: (score: number) => {
    if (!score) return ' ';

    return (score / 10).toFixed(1);
  },
});
