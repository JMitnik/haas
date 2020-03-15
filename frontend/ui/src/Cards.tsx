import styled, { css } from 'styled-components';
import { Div } from './Generics';

export const Card = styled(Div)`
  ${({ theme }) => css`
      position: relative;
      border-radius: ${theme.borderRadiuses.md};
      background: ${theme.colors.white};
      color: ${theme.colors.default.darkest};
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
      cursor: pointer;
      &:hover ${Div} {
        transition: all 0.2s ease-in;
        box-shadow: 0 1px 3px 1px rgba(0,0,0,0.1);
    }
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
