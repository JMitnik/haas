import Color from 'color';

export const isValidColor = (color: string) => {
  if (!color) return false;

  const regExp = color.match(/^(#(\d|\D){6}$){1}/);
  if (!regExp || regExp.length === 0) {
    return false;
  }
  try {
    Color(color, 'hex');
  } catch (e) {
    return false;
  }

  return true;
};

export const isDarkColor = (color: string) => {
  if (!color) return false;

  return Color(color).isDark();
};

export const generatePalette = (color: string) => ({
  100: Color(color).lighten(0.80).hex(),
  200: Color(color).lighten(0.45).hex(),
  300: Color(color).lighten(0.3).hex(),
  400: Color(color).lighten(0.15).hex(),
  500: color,
  600: Color(color).darken(0.15).hex(),
  700: Color(color).darken(0.30).hex(),
  800: Color(color).darken(0.45).hex(),
  900: Color(color).darken(0.60).hex(),
});
