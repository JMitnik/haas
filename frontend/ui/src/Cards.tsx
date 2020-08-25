import styled, { css } from 'styled-components/macro';
import { Div } from './Generics';
import { Flex } from './Container';

interface CardProps {
  noHover?: boolean;
}

export const Card = styled(Div)<CardProps>`
  ${({ theme, noHover }) => css`
    position: relative;
    box-shadow: 0 1px 2px 0 rgba(0,0,0,.05);
    display: flex;
    flex-direction: column;
    border-radius: ${theme.borderRadiuses.somewhatRounded};
    cursor: pointer;

    ${!noHover && css`
      &:hover {
        transition: all .3s cubic-bezier(.55,0,.1,1);
        box-shadow: 0 4px 6px -1px rgba(0,0,0,.1),0 2px 4px -1px rgba(0,0,0,.06)!important;
      }
    `}
  `}
`;

export const AddCard = styled(Card)`
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

export const CardBody = styled(Div)`
  ${({ theme }) => css`
    padding: ${theme.gutter * 0.75}px;
    flex-grow: 1;
    position: relative;
  `}
`;

export const CardFooter = styled(Div)`
  ${({ theme }) => css`
    padding: 8px ${theme.gutter * 0.75}px;
    border-radius: 0 0 ${theme.borderRadiuses.md} ${theme.borderRadiuses.md};
    color: ${theme.colors.default.text};
  `}
`;

export default Card;
