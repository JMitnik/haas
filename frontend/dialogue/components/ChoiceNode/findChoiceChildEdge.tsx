import { Choice, Edge } from '../../types/helper-types';

/**
 * Given a choice-option value, and a list of Edges, find next Edge.
 * @param value
 * @param edges
 * @returns
 */
export const findChoiceChildEdge = (choice: Choice, edges: Edge[]): Edge => {
  const releventEdges = edges.filter(edge => {
    const relevantEdges = edge.conditions.filter(condition => {
      if (choice.value === condition.matchValue) {
        return true;
      }

      return false;
    });

    return relevantEdges.length > 0;
  });

  return releventEdges[0];
};
