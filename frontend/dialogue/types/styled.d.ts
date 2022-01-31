import 'styled-components';

import { Theme } from '../config/Theme/theme';

declare module 'styled-components' {
  export interface DefaultTheme extends Theme {}
}
