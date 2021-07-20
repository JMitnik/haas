import { EdgeConditionProps } from './DialogueBuilderInterfaces';

export const findProblemsInChildCondition = (
  childConditions: (EdgeConditionProps | undefined)[],
) => (
  childConditions.map((mainCondition, conditionIndex) => {
    const otherProblems = childConditions.map((otherChild, otherChildIndex) => {
      if (conditionIndex === otherChildIndex) {
        return undefined;
      }

      if (!mainCondition || !otherChild) {
        return undefined;
      }

      if (
        mainCondition.renderMax === undefined
        || mainCondition.renderMax === null
        || mainCondition.renderMin === undefined
        || mainCondition.renderMin === null
      ) {
        return undefined;
      }

      if (
        otherChild.renderMax === undefined
        || otherChild.renderMax === null
        || otherChild.renderMin === undefined
        || otherChild.renderMin === null
      ) {
        return undefined;
      }

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

      if (mainCondition.renderMax > otherChild?.renderMin && mainCondition?.renderMin < otherChild?.renderMin) {
        return {
          originIndex: conditionIndex,
          problemWithCondition: {
            renderMin: otherChild?.renderMax,
            renderMax: otherChild?.renderMax,
          },
          problemWith: otherChildIndex,
          problemType: 'partialOverlap',
        };
      }

      if (mainCondition.renderMin < otherChild?.renderMax && mainCondition?.renderMax > otherChild?.renderMax) {
        return {
          originIndex: conditionIndex,
          problemWithCondition: {
            renderMin: otherChild?.renderMax,
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
