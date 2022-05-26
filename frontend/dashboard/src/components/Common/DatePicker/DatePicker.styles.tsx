// import 'react-datepicker/dist/react-datepicker.css';
import styled, { css } from 'styled-components';

import { saneDefaults } from './defaultDatePickerStyles';

export const DatePickerContainer = styled.div`
  ${({ theme }) => css`
    ${saneDefaults}

    /* Main container */
    .react-datepicker {
      background-color: ${theme.colors.white};;
      color: ${theme.colors.off[500]};
      border: 1px solid ${theme.colors.neutral[400]};
      border-radius: ${theme.borderRadiuses.md}px;
      box-shadow: ${theme.boxShadows.md};
    }

    /* Header */
    .react-datepicker__current-month, .react-datepicker-time__header, .react-datepicker-year-header {
      margin-top: 0;
      color: ${theme.colors.off[700]};
      font-weight: 900;
      font-size: 1rem;
      padding-bottom: ${theme.gutter / 3}px;
    }

    .react-datepicker__header {
      text-align: center;
      position: relative;
      background-color: ${theme.colors.neutral[500]};
      border-bottom: 1px solid ${theme.colors.neutral[300]};
      border-radius: ${theme.borderRadiuses.md}px ${theme.borderRadiuses.md}px 0 0;
      padding: ${theme.gutter / 3}px 0;
    }

    .react-datepicker__navigation {
      align-items: center;
      background: none;
      display: flex;
      justify-content: center;
      text-align: center;
      cursor: pointer;
      position: absolute;
      top: 2px;
      padding: 0;
      border: none;
      z-index: 1;
      height: 38px;
      width: 32px;
      text-indent: -999em;
      overflow: hidden;
    }

    .react-datepicker__navigation--next {
      right: 2px;
    }

    .react-datepicker__navigation-icon--previous {
      right: -2px;
    }

    .react-datepicker__navigation-icon {
      position: relative;
      top: -1px;
      font-size: 20px;
      width: 0;
    }

    .react-datepicker__navigation-icon--previous::before {
      transform: translateY(-50%) rotate(225deg);
      right: -7px;
    }

    .react-datepicker__navigation-icon--next::before {
      transform: translateY(-50%) rotate(45deg);
      left: -7px;
    }

    .react-datepicker__navigation-icon::before {
      border-color: ${theme.colors.off[300]};
      border-style: solid;
      border-width: 3px 3px 0 0;
      content: "";
      display: block;
      height: 9px;
      position: absolute;
      top: 50%;
      width: 9px;
    }

    .react-datepicker__day-name, .react-datepicker__day, .react-datepicker__time-name {
      color: ${theme.colors.off[700]};
      display: inline-block;
      width: 1.7rem;
      line-height: 1.7rem;
      text-align: center;
      margin: 0.166rem;
    }

    .react-datepicker__day--selected,
    .react-datepicker__day--in-selecting-range,
    .react-datepicker__day--in-range,
    .react-datepicker__month-text--selected,
    .react-datepicker__month-text--in-selecting-range,
    .react-datepicker__month-text--in-range,
    .react-datepicker__quarter-text--selected,
    .react-datepicker__quarter-text--in-selecting-range,
    .react-datepicker__quarter-text--in-range,
    .react-datepicker__year-text--selected,
    .react-datepicker__year-text--in-selecting-range,
    .react-datepicker__year-text--in-range {
      border-radius: 0.3rem;
      background-color: ${theme.colors.main[500]};
      color: ${theme.colors.white};
    }

    /* .react-datepicker__day--keyboard-selected,
    .react-datepicker__month-text--keyboard-selected,
    .react-datepicker__quarter-text--keyboard-selected,
    .react-datepicker__year-text--keyboard-selected {
      border-radius: 0.3rem;
      background-color: ${theme.colors.main[300]};
      color: ${theme.colors.white};
    } */

    .react-datepicker__day-names, .react-datepicker__week {
      white-space: nowrap;
    }
  `}
`;

export const DatePickerButton = styled.button`
  ${({ theme }) => css`
    padding: ${theme.gutter / 3}px ${theme.gutter / 2}px;
    border-radius: ${theme.borderRadiuses.md}px;
    border: 1px solid ${theme.colors.off[200]};
    color: ${theme.colors.off[500]};
    font-weight: 500;
  `}
`;
