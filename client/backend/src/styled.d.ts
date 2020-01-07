// import original module declarations
import 'styled-components'
import theme from './config/theme';

type Theme = typeof theme;

declare module 'styled-components' {
  export interface DefaultTheme extends Theme {}
}
