import { ReactDatePickerProps } from 'react-datepicker';

declare module 'react-flagpack';

declare module '*.ttf';

declare module '*.svg' {
  import * as React from 'react';

  export const ReactComponent: React.FunctionComponent<
  React.SVGProps<SVGSVGElement> & { title?: string }
  >;
}

declare module 'react-datepicker' {
  export interface ReactDatePickerExtraProps extends ReactDatePickerProps {
    selectsRange?: boolean;
  }
}
