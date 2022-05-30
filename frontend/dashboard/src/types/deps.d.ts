import { ReactDatePickerProps as BaseReactDatePickerProps } from 'react-datepicker';

declare module 'react-flagpack';

declare module '*.ttf';

declare module '*.svg' {
  import * as React from 'react';

  export const ReactComponent: React.FunctionComponent<
  React.SVGProps<SVGSVGElement> & { title?: string }
  >;
}

/**
 * React datepicker seems to be missing a prop for their range picker.
 */
declare module 'react-datepicker' {
  export interface ReactDatePickerProps extends BaseReactDatePickerProps {
    selectsRange?: boolean;
  }
}
