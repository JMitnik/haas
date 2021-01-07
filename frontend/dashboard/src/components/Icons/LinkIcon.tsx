/* eslint-disable max-len */
import React from 'react';

import styled, { css } from 'styled-components';

const Svg = styled.svg <{isCTA?: Boolean, hasCTA?: Boolean}>`
  ${({ hasCTA, isCTA, theme }) => css`
    color: ${theme.colors.default.darkest};
  
    path {
      ${!isCTA && css`
        fill: white;
      `}
      ${(isCTA && !hasCTA) && css`
        fill: ${theme.colors.default.darkest};
        opacity: 0.4;
      `}
      ${hasCTA && css`
        fill: ${theme.colors.default.darkest};
        opacity: 1;
      `}
    }
  `}
`;

const LinkIcon = ({ color, isCTA, hasCTA } : { color?: string, isCTA?: Boolean, hasCTA?: Boolean }) => (
  <Svg isCTA={isCTA} hasCTA={hasCTA} width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M19.48 13.03L19.46 13C19.33 12.7679 19.2976 12.4938 19.3698 12.2378C19.442 11.9818 19.6129 11.765 19.845 11.635C20.0771 11.505 20.3512 11.4726 20.6072 11.5448C20.8632 11.617 21.08 11.7879 21.21 12.02C21.7322 12.9326 22.0055 13.9664 22.0023 15.0179C21.9992 16.0693 21.7198 17.1015 21.1921 18.011C20.6645 18.9205 19.9071 19.6753 18.9958 20.1999C18.0846 20.7245 17.0515 21.0004 16 21H12C10.4087 21 8.88258 20.3679 7.75736 19.2426C6.63214 18.1174 6 16.5913 6 15C6 13.4087 6.63214 11.8826 7.75736 10.7574C8.88258 9.63214 10.4087 9 12 9H13C13.2652 9 13.5196 9.10536 13.7071 9.29289C13.8946 9.48043 14 9.73478 14 10C14 10.2652 13.8946 10.5196 13.7071 10.7071C13.5196 10.8946 13.2652 11 13 11H12C10.9391 11 9.92172 11.4214 9.17157 12.1716C8.42143 12.9217 8 13.9391 8 15C8 16.0609 8.42143 17.0783 9.17157 17.8284C9.92172 18.5786 10.9391 19 12 19H16C16.6991 18.9998 17.386 18.8163 17.9921 18.4679C18.5982 18.1196 19.1024 17.6184 19.4545 17.0144C19.8066 16.4104 19.9942 15.7247 19.9987 15.0256C20.0031 14.3265 19.8243 13.6384 19.48 13.03Z"
    />
    <path
      d="M4.51991 10.97L4.53991 11C4.60426 11.1149 4.64534 11.2414 4.66082 11.3721C4.6763 11.5029 4.66586 11.6355 4.63011 11.7622C4.59436 11.889 4.53399 12.0075 4.45246 12.1109C4.37092 12.2143 4.26982 12.3007 4.15491 12.365C4.04 12.4293 3.91355 12.4704 3.78276 12.4859C3.65198 12.5014 3.51943 12.491 3.39267 12.4552C3.26592 12.4195 3.14745 12.3591 3.04403 12.2775C2.94061 12.196 2.85426 12.0949 2.78991 11.98C2.26768 11.0674 1.99445 10.0336 1.99759 8.98211C2.00072 7.93065 2.28011 6.89848 2.80777 5.989C3.33543 5.07952 4.09283 4.32467 5.00408 3.80009C5.91534 3.2755 6.94845 2.99959 7.99991 3H11.9999C13.5912 3 15.1173 3.63214 16.2426 4.75736C17.3678 5.88258 17.9999 7.4087 17.9999 9C17.9999 10.5913 17.3678 12.1174 16.2426 13.2426C15.1173 14.3679 13.5912 15 11.9999 15H10.9999C10.7347 15 10.4803 14.8946 10.2928 14.7071C10.1053 14.5196 9.99991 14.2652 9.99991 14C9.99991 13.7348 10.1053 13.4804 10.2928 13.2929C10.4803 13.1054 10.7347 13 10.9999 13H11.9999C13.0608 13 14.0782 12.5786 14.8283 11.8284C15.5785 11.0783 15.9999 10.0609 15.9999 9C15.9999 7.93913 15.5785 6.92172 14.8283 6.17157C14.0782 5.42143 13.0608 5 11.9999 5H7.99991C7.3008 5.00022 6.61395 5.18367 6.00783 5.53205C5.40171 5.88044 4.89749 6.38161 4.54542 6.9856C4.19334 7.58958 4.00572 8.2753 4.00124 8.9744C3.99677 9.67349 4.1756 10.3616 4.51991 10.97Z"
    />
  </Svg>
);

export default LinkIcon;
