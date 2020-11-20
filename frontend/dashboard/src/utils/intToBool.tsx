const intToBool = (optionalBoolean: number | boolean | undefined) => {
  if (typeof optionalBoolean === 'number') {
    return optionalBoolean === 1;
  }

  if (typeof optionalBoolean === 'boolean') return optionalBoolean;

  return undefined;
};

export default intToBool;
