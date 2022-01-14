import { CheckedConditions } from './AutomationTypes';

export class AutomationConditionBuilderService {
  /**
   * Compares validated condition results against its operator types
   * @param data an object containing a list of booleans with AND/OR as its property as well as nested object containing the same
   * @returns Boolean. true if conditions are passed according to their AND/OR property, false otherwise.
   */
  static checkConditions = (data: CheckedConditions) => {
    const summarizedList: boolean[] = [];
    const isAND = !!data['AND']

    const checkConditions = data[isAND ? 'AND' : 'OR'] as (boolean | CheckedConditions)[]
    checkConditions.forEach((entry) => {
      // If entry is regular boolean => push to summarized array
      if (typeof entry === 'boolean') {
        summarizedList.push(entry);
      }

      // If entry is an object => Check for booleans in nested object
      if (typeof entry === 'object') {
        // If property equals AND => Check whether ALL conditions have passed and are true
        if (entry['AND']) {
          const areAllTrueValues = entry.AND.every((andEntry) => {
            // If object => recursively run function again to check nested object
            if (typeof andEntry === 'object') {
              return AutomationConditionBuilderService.checkConditions(andEntry);
            }
            return andEntry === true;
          });

          summarizedList.push(areAllTrueValues);
        }

        // If property equals OR => Check whether at least one condition is true
        if (entry['OR']) {
          const someTrueValues = entry.OR.some((orEntry) => {
            // If object => recursively run function again to check nested object
            if (typeof orEntry === 'object') {
              return AutomationConditionBuilderService.checkConditions(orEntry)
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
