import styled, { css } from 'styled-components/macro';
import { Div } from './Generics';
import { Flex } from './Container';
import { Span } from './Span';

type BoxShadowSize = 'sm' | 'md' | 'lg';

interface CardProps {
  noHover?: boolean;
  isFlat?: boolean;
  outline?: boolean;
  boxShadow?: BoxShadowSize;
}

export const Card = styled(Div)<CardProps>`
  ${({ theme, noHover, boxShadow, outline, isFlat }) => css`
    position: relative;
    display: flex;
    flex-direction: column;
    border-radius: ${theme.borderRadiuses.somewhatRounded};
    transition: all .3s cubic-bezier(.55,0,.1,1);

    box-shadow: rgba(0, 0, 0, 0.08) 0px 4px 12px;
    transition: all .3s cubic-bezier(.55,0,.1,1);

    &:focus-within {
      transition: all .3s cubic-bezier(.55,0,.1,1);
      box-shadow: rgba(0, 0, 0, 0.20) 0px 4px 12px;
    }

    ${isFlat && css`
      box-shadow: none;
    `}

    ${!noHover && css`
      cursor: pointer;

      &:hover {
        transition: all .3s cubic-bezier(.55,0,.1,1);
        box-shadow: rgba(0, 0, 0, 0.20) 0px 4px 12px;
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

export const CardScore = styled(Span)`
  ${({ theme }) => css`
    text-align: center;
    font-weight: 800;
    padding: 4px 8px;
    margin-bottom: 12px;
    font-size: 9px;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 2px solid ${theme.colors.gray['400']};
    color: ${theme.colors.gray['400']};
    border-radius: 30px;
  `}
`;

export default Card;
