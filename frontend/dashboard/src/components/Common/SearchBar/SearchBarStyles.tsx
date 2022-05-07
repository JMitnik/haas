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

interface SearchbarInputProps {
  muted?: boolean;
}

export const SearchbarInput = styled.input<SearchbarInputProps>`
  ${({ theme, muted }) => css`
    width: 100%;
    padding: 8px 12px;
    border-radius: ${theme.borderRadiuses.md}px;
    box-shadow: ${theme.boxShadows.sm};
    background: ${theme.colors.neutral[500]};
    outline: none;
    border: 1px solid ${theme.colors.neutral[500]};
    transition: ${theme.transitions.normal};
    padding-right: 2.5rem;

    ${muted && css`
      color: ${theme.colors.neutral[200]};
    `}

    ${InputIcon} + & {
      padding-left: 2.5rem;
    }

    &:focus {
      transition: ${theme.transitions.normal};
      background: ${theme.colors.neutral[100]};
      box-shadow: ${theme.boxShadows.md};
    }
  `}
`;
