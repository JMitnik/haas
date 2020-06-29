export const isValidColor = (color: string) => {
  const regExp = color.match(/^(#(\d|\D){6}$){1}/);
  if (!regExp || regExp.length === 0) {
    return false;
  }
  return true;
};

export default isValidColor;

