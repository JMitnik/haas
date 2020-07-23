import styled, { css } from 'styled-components/macro';

import { Button } from '@haas/ui';

const AddCTAButton = styled(Button)`
   ${({ theme, disabled }) => css`
    padding: 4px 0px;
    background-color: ${theme.colors.default.dark};
    font-size: 0.8em;
    color: ${theme.colors.default.darkest};
    border: 0px;
    min-width: 80px;
    display: flex;
    margin-left: 20px;
    ${!disabled && css`
      &:hover {
        transition: all 0.2s ease-in;
      box-shadow: 0 1px 3px 1px rgba(0,0,0,0.2) !important;
      }
    `}
    svg {
        margin-right: 2px;
        color: ${theme.colors.default.darkest};
        width: 10px;
        height: 10px;
    }
  `}
`;

export default AddCTAButton;
