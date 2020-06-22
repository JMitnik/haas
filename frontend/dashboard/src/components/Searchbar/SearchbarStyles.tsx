import styled, { css } from 'styled-components/macro';

export const SearchbarContainer = styled('div')`
  ${({ theme }) => css`
    background: ${theme.colors.app.mutedOnDefault};
    color: ${theme.colors.app.mutedAltOnDefault};
    font-weight: bold;
    border-radius: ${theme.borderRadiuses.rounded};

    input {
      padding: 8px 12px;
      background: none;
      color: inherit;
      border: none;
    }
  `}
`;
