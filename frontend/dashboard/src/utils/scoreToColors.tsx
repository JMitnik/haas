interface ScoreColorOutput {
  color: string;
  background: string;
}

const scoreToColors = (score: number): ScoreColorOutput => {
  // Negative score
  if (score < 50) {
    return {
      background: '#FC8181',
      color: 'white',
    };
  }

  // Somewhat neutral
  if (score >= 50 && score < 75) {
    return {
      background: '#F6AD55',
      color: 'white',
    };
  }

  // Good
  if (score >= 75 && score < 95) {
    return {
      background: '#68D391',
      color: 'white',
    };
  }

  // Excellent
  if (score >= 95) {
    return {
      background: '#63B3ED',
      color: 'white',
    };
  }

  return {
    background: 'black',
    color: 'white',
  };
};

export default scoreToColors;
