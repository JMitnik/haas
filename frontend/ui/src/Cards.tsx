import styled, { css } from 'styled-components/macro';
import { Div } from './Generics';

export const Card = styled(Div)`
  ${({ theme }) => css`
      position: relative;
      border-radius: ${theme.borderRadiuses.md};
      background: ${theme.colors.white};
      color: ${theme.colors.default.darkest};
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
      cursor: pointer;
  `}
`;

export const CardBody = styled(Div)`
  ${({ theme }) => css`
    padding: ${theme.gutter}px;
    position: relative;
  `}
`;

export const CardFooter = styled(Div)`
  ${({ theme }) => css`
    padding: ${theme.gutter / 1.5}px;
    border-radius: 0 0 ${theme.borderRadiuses.md} ${theme.borderRadiuses.md};
    background: ${theme.colors.default.light};
    color: ${theme.colors.default.text};
    text-align: center;
  `}
`;

export default Card;
