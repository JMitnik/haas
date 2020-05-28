import React from 'react';

interface ThemeProps {
  theme: any;
}

export const ThemeProps = React.createContext({} as ThemeProps);
