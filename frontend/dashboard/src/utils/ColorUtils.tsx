import Color from 'color';

export const isValidColor = (color: string) => {
  const regExp = color.match(/^(#(\d|\D){6}$){1}/);
  if (!regExp || regExp.length === 0) {
    return false;
  }
  try {
    const colorInstance = Color(color, 'hex');
  } catch (e) {
    return false;
  }
  return true;
};
