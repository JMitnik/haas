import { Edge } from '../../types/helper-types';

/**
 * Given a slider-value, and a list of Edges, find next Edge.
 * @param value
 * @param edges
 * @returns
 */
export const findSliderChildEdge = (value: number, edges: Edge[]): Edge => {
  const releventEdges = edges.filter(edge => {
    const relevantEdges = edge.conditions.filter(condition => {
      if (condition?.renderMin < value && condition?.renderMax >= value) {
        return true;
      }

      return false;
    });

    return relevantEdges.length > 0;
  });

  return releventEdges[0];
};