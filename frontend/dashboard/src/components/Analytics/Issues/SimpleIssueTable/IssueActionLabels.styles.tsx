import styled, { css } from 'styled-components';

export const ContactActionLabel = styled.div`
  ${({ theme }) => css`
    background: ${theme.colors.red[100]};
    color: ${theme.colors.red[500]};
    font-weight: 700;
    display: inline-block;s
    line-height: 1rem;
    font-size: 0.6rem;
    border-radius: 4px;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    padding: 1px 4px;

    svg {
      max-width: 16px;
      margin-right: ${theme.gutter / 6}px;
    }
  `}
`;
