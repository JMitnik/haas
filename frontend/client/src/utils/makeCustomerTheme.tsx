import { removeEmpty } from './removeEmpty';

export const makeCustomTheme = (currTheme: any, customTheme: any) => {
  const colors = {...currTheme?.colors, ...removeEmpty({...customTheme?.colors})};
  const newTheme = {...currTheme, colors};

  return newTheme;
};
