export const removeEmpty = (obj: any) => {
  return Object.keys(obj).reduce((acc, key) => {
    // value is "falsey" or is empty array
    return !obj[key] || (Array.isArray(obj[key]) && !obj[key].length)
      ? acc
      : { ...acc, [key]: obj[key] };
  }, {});
};
