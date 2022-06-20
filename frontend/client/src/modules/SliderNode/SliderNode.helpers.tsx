import { Edge } from 'types/core-types';

/**
 * Given a slider-value, and a list of Edges, find next Edge.
 * @param value
 * @param edges
 * @returns
 */
export const findSliderChildEdge = (value: number, edges: Edge[]): Edge => {
  const releventEdges = edges.filter((edge) => {
    const relevantEdges = edge.conditions?.filter((condition) => {
      // Check if we meet the minimum condition: if we fail, return early
      if (
        condition.renderMin !== undefined
        && condition.renderMin !== null
        && condition.renderMin > value
      ) {
        return false;
      }

      // Check if we meet the maximum condition: if we fail, return early
      if (
        condition.renderMax !== undefined
        && condition.renderMax !== null
        && condition.renderMax <= value
      ) {
        return false;
      }

      return true;
    }) || [];

    return relevantEdges.length > 0;
  });

  return releventEdges[0];
};
