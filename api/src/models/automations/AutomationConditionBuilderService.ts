import { CheckedConditions } from "./AutomationTypes";

export class AutomationConditionBuilderService {
  static checkConditions = (example: CheckedConditions, summarizedList: boolean[], depth: number) => {
    const isAND = !!example['AND']
    depth++;
    const checkConditions = example[isAND ? 'AND' : 'OR'] as (boolean | CheckedConditions)[]
    checkConditions.forEach((entry) => {
      if (typeof entry === 'boolean') {
        summarizedList.push(entry);
      }

      if (typeof entry === 'object') {
        if (entry['AND']) {
          const areAllTrueValues = entry.AND.every((andEntry) => {
            if (typeof andEntry === 'object') {
              return this.checkConditions(andEntry, [], depth);
            }
            return andEntry === true;
          });
          summarizedList.push(areAllTrueValues);
        }

        if (entry['OR']) {
          const someTrueValues = entry.OR.some((orEntry) => {
            if (typeof orEntry === 'object') {
              return this.checkConditions(orEntry, [], depth)
            }
            return orEntry === true;
          });
          summarizedList.push(someTrueValues);
        }

      }
    });

    const allConditionsPassed = isAND ? summarizedList.every((entry) => entry) : summarizedList.some((entry) => entry);
    return allConditionsPassed;
  }
}

export default AutomationConditionBuilderService;
