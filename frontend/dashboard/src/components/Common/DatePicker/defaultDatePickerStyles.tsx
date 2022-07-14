import { css } from 'styled-components';

export const saneDefaults = css`
  .react-datepicker {
    display: inline-block;
    position: relative;
    font-size: 0.8rem;
  }

  .react-datepicker__month {
    margin: 0.4rem;
    text-align: center;
  }

  .react-datepicker__day, .react-datepicker__month-text, .react-datepicker__quarter-text, .react-datepicker__year-text {
    cursor: pointer;
  }
`;

export const defaultDatePickerStyles = css`
  .react-datepicker {
    font-size: 0.8rem;
    background-color: #fff;
    color: #000;
    border: 1px solid #aeaeae;
    border-radius: 0.3rem;
    display: inline-block;
    position: relative;
  }

  .react-datepicker__month {
    margin: 0.4rem;
    text-align: center;
  }

  .react-datepicker__day, .react-datepicker__month-text, .react-datepicker__quarter-text, .react-datepicker__year-text {
    cursor: pointer;
  }

  .react-datepicker__current-month, .react-datepicker-time__header, .react-datepicker-year-header {
    margin-top: 0;
    color: #000;
    font-weight: bold;
    font-size: 0.944rem;
  }

  .react-datepicker__header:not(.react-datepicker__header--has-time-select) {
    border-top-right-radius: 0.3rem;
  }

  .react-datepicker__header {
    text-align: center;
    background-color: #f0f0f0;
    border-bottom: 1px solid #aeaeae;
    border-top-left-radius: 0.3rem;
    padding: 8px 0;
    position: relative;

    &:not(.react-datepicker__header--has-time-select) {
      border-top-right-radius: 0.3rem;
    }
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
    height: 32px;
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
    transform: rotate(225deg);
    right: -7px;
  }

  .react-datepicker__navigation-icon--next::before {
    transform: rotate(45deg);
    left: -7px;
  }

  .react-datepicker__navigation-icon::before {
    border-color: #ccc;
    border-style: solid;
    border-width: 3px 3px 0 0;
    content: "";
    display: block;
    height: 9px;
    position: absolute;
    top: 6px;
    width: 9px;
  }

  .react-datepicker__day-name, .react-datepicker__day, .react-datepicker__time-name {
    color: #000;
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
    background-color: #216ba5;
    color: #fff;
  }

  .react-datepicker__day--keyboard-selected,
  .react-datepicker__month-text--keyboard-selected,
  .react-datepicker__quarter-text--keyboard-selected,
  .react-datepicker__year-text--keyboard-selected {
    border-radius: 0.3rem;
    background-color: #2579ba;
    color: #fff;

  .react-datepicker__day-names, .react-datepicker__week {
    white-space: nowrap;
  }

  .react-datepicker__header {
    text-align: center;
    background-color: #f0f0f0;
    border-bottom: 1px solid #aeaeae;
    border-top-left-radius: 0.3rem;
    padding: 8px 0;
    position: relative;
  }
`;
