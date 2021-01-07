import { Div } from '@haas/ui';
import styled, { css } from 'styled-components';

export const SearchbarInputContainer = styled.div`
  position: relative;
`;

export const InputIcon = styled(Div)`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2.5rem;
  height: 100%;
  position: absolute;
  top: 50%;
  transform: translateY(-50%);

  svg {
    stroke: #838890;
    width: 1em;
  }
`;

export const EmptyInputIcon = styled(InputIcon)`
  right: 0;
`;

export const SearchbarInput = styled.input`
  ${({ theme }) => css`
    width: 100%;
    padding: 8px 12px;
    border-radius: 6px;
    border: 0;
    background: ${theme.colors.app.mutedOnDefault};
    outline: none;
    border: 1px solid transparent;
    transition: all 0.2s ease-in;
    padding-right: 2.5rem;

    ${InputIcon} + & {
      padding-left: 2.5rem;
    }


    &:focus {
      transition: all 0.2s ease-in;
      border: 1px solid ${theme.colors.app.mutedAltOnDefault};
      box-shadow: 0 0 0 1px ${theme.colors.app.mutedAltOnDefault};
    }
  `}
`;
