
/** Example: {'primary: '#ddd'} */
export type FlatThemeEntry = Record<string, string>;

/** Example: { 300: 'ddd' }. Used commonly for shades */
export type KeyedThemeSubEntry = Record<number, string>;

export type KeyedThemeEntry = Record<string, {
  [key: number]: string
}>;

export type ThemeEntry = KeyedThemeEntry | FlatThemeEntry;

export type ColorsLiteral = 'colors';

export type ColorsTheme = Record<ColorsLiteral, ThemeEntry>;
