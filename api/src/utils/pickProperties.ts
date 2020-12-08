import _ from 'lodash';

/**
 * Picks properties out of object `obj`, and maps them to undefined
 */
export const pickProperties = (obj: any, properties: string[]) => {
  const pickedProperties = _.pick(_.mapValues(obj, (o) => (_.isNil(o) ? undefined : o)) as typeof obj,
    properties);

  return pickedProperties;
};
