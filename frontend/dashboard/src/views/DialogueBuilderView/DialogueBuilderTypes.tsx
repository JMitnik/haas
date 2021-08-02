export interface QuestionNodeProblem {
  originIndex: number,
  problemWith: number,
  problemType: 'partialOverlap' | 'fullOverlap',
  problemWithCondition: {
    renderMin: number;
    renderMax: number;
  }
}
