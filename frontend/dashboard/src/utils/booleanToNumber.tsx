const booleanToNumber = (optionalBoolean: number | boolean | undefined) => {
  if (typeof optionalBoolean === 'number') {
    return optionalBoolean;
  }

  if (typeof optionalBoolean === 'boolean') {
    return optionalBoolean ? 1 : 0;
  }

  return undefined;
};

export default booleanToNumber;
