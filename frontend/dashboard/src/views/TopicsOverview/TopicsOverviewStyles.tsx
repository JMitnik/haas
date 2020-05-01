import { Div, Card } from '@haas/ui';
import styled, { css } from 'styled-components';

export const AddTopicCard = styled(Card)`
  ${({ theme }) => css`
    position: relative;

    &:hover ${Div} {
      box-shadow: 0 1px 3px 1px rgba(0,0,0,0.1);
    }

    ${Div} {
      height: 100%;
      border-radius: ${theme.borderRadiuses.md}
      border: 1px solid ${theme.colors.default.light};
      transition: all 0.2s ease-in;
      display: flex;
      align-items: center;
      flex-direciton: column;
      justify-content: center;
      background: #f7f9fe;
    }

    a {
      position: absolute;
      left: 0;
      right: 0;
      bottom: 0;
      top: 0;
      text-decoration: none;
    }
  `}
`;
