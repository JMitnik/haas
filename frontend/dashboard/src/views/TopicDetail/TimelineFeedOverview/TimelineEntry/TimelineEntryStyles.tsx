import styled, { css } from 'styled-components/macro';

export const TimelineEntryContainer = styled.div`
   ${({ theme }) => css`
    padding: 8px 14px;
    border-radius: ${theme.borderRadiuses.md};
    background: ${theme.colors.primaryAlt};
    color: ${theme.colors.primary};
    margin: ${theme.gutter}px 0;
    transition: all 0.2s ease-in;
    cursor: pointer;

    :hover {
      transition: all 0.2s ease-in;
      background: ${theme.colors.primary};
      color: white;
    }
  `}
`;
