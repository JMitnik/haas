import { Card, Div, Flex } from '@haas/ui';
import styled, { css } from 'styled-components';

export const TranslatedPlus = styled(Div)`
   ${({ theme }) => css`
      transform: translate(25px, -10px);
      color: ${theme.colors.default.normalAlt};
    `};
`;

export const AddDialogueCard = styled(Card)`
  ${({ theme }) => css`
    position: relative;

    background: none;
    border: none;
    border-radius: none;

    ${Flex} {
      height: 100%;
      border-radius: ${theme.borderRadiuses.md};
      border: 5px solid ${theme.colors.default.normalAlt};
      transition: all 0.2s ease-in;
      display: flex;
      align-items: center;
      flex-direction: column;
      justify-content: center;

      svg {
        color: ${theme.colors.default.dark};
      }
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

const FlexRow = styled(Div)`
  display: flex;
  flex-direction: row;
`;

export const InputContainer = styled(FlexRow)`
  align-items: center;
`;
