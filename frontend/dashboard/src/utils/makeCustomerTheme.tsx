import { DEPRECATED_breakpoints } from 'config/theme';
import { removeEmpty } from './removeEmpty';

export const makeCustomTheme = (currTheme: any, customTheme: any) => {
  const colors = {
    ...currTheme?.colors,
    ...removeEmpty({ ...customTheme?.colors }),
  };

  return { ...currTheme, colors, isDarkColor: customTheme.isDarkColor, breakpoints: DEPRECATED_breakpoints  };
};
