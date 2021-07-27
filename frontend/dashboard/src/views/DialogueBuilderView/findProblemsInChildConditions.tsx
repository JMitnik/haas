import { EdgeConditionProps } from './DialogueBuilderInterfaces';

/**
 * Finds problems in child-conditions (such as overlapping ranges).
 * Returns a list of either problems or undefined.
 * */
export const findProblemsInChildCondition = (
  childConditions: (EdgeConditionProps | undefined)[],
) => (
  childConditions.map((mainCondition, conditionIndex) => {
    const otherProblems = childConditions.map((otherChild, otherChildIndex) => {
      // Don't check for yourself.
      if (conditionIndex === otherChildIndex) {
        return undefined;
      }

      // Type check
      if (!mainCondition || !otherChild) {
        return undefined;
      }

      // Check that these conditions are not null or undefined (only works on SLIDER)
      if (
        mainCondition.renderMax === undefined
        || mainCondition.renderMax === null
        || mainCondition.renderMin === undefined
        || mainCondition.renderMin === null
      ) {
        return undefined;
      }

      // Check that these conditions are not null or undefined (only works on SLIDER)
      if (
        otherChild.renderMax === undefined
        || otherChild.renderMax === null
        || otherChild.renderMin === undefined
        || otherChild.renderMin === null
      ) {
        return undefined;
      }

      // Check that the current examined edge-condition does not fully overlap with another edge condition
      if (mainCondition.renderMax >= otherChild?.renderMax && mainCondition?.renderMin <= otherChild?.renderMin) {
        return {
          originIndex: conditionIndex,
          problemWithCondition: {
            renderMin: otherChild.renderMin,
            renderMax: otherChild.renderMax,
          },
          problemWith: otherChildIndex,
          problemType: 'fullOverlap',
        };
      }

      // Check that the current examined edge-condition does not partially overlap with the HIGHER neighbour.
      if (mainCondition.renderMax > otherChild?.renderMin && mainCondition?.renderMin < otherChild?.renderMin) {
        return {
          originIndex: conditionIndex,
          problemWithCondition: {
            renderMin: otherChild?.renderMin,
            renderMax: otherChild?.renderMax,
          },
          problemWith: otherChildIndex,
          problemType: 'partialOverlap',
        };
      }

      // Check that the current examined edge-condition does not partially overlap with the LOWER neighbour.
      if (mainCondition.renderMin < otherChild?.renderMax && mainCondition?.renderMax > otherChild?.renderMax) {
        return {
          originIndex: conditionIndex,
          problemWithCondition: {
            renderMin: otherChild?.renderMin,
            renderMax: otherChild?.renderMax,
          },
          problemWith: otherChildIndex,
          problemType: 'partialOverlap',
        };
      }

      return undefined;
    });

    return otherProblems.filter((problem) => !!problem);
  }).map((problemList) => (problemList.length ? problemList : undefined)) || []
);
