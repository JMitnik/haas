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

export const AddCard = styled(Card)`
  ${({ theme }) => css`
    position: relative;

    &:hover ${Div} {
      transition: all 0.2s ease-in;
      box-shadow: 0 1px 3px 1px rgba(0,0,0,0.1);
    }

    ${Div} {
      height: 100%;
      border: 1px solid ${theme.colors.default.light};
      transition: all 0.2s ease-in;
      display: flex;
      align-items: center;
      flex-direciton: column;
      justify-content: center;
      background: ${theme.colors.default.light};
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
