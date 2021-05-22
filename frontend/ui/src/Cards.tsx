import styled, { css } from 'styled-components';
import { Div } from './Generics';
import { Flex } from './Container';
import { Span } from './Span';
import { Button } from './Buttons/Buttons';

type BoxShadowSize = 'sm' | 'md' | 'lg';

interface CardProps {
  noHover?: boolean;
  isFlat?: boolean;
  outline?: boolean;
  boxShadow?: BoxShadowSize;
  willFocusWithin?: boolean;
}

export const Card = styled(Div) <CardProps>`
  ${({ theme, noHover, boxShadow, outline, isFlat, willFocusWithin }) => css`
    position: relative;
    display: flex;
    flex-direction: column;
    border-radius: ${theme.borderRadiuses.somewhatRounded};
    box-shadow: rgba(0, 0, 0, 0.08) 0px 4px 12px;

    ${willFocusWithin && css`
      &:focus-within {
        transition: all .3s cubic-bezier(.55,0,.1,1);
        box-shadow: rgba(0, 0, 0, 0.20) 0px 4px 12px;
      }
    `}

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

export const ButtonCard = styled(Button) <{ isActive: boolean }>`
  ${({ theme, isActive }) => css`
    border-radius: ${theme.borderRadiuses.md};
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
    border: 1px solid #ebebeb;
    padding: 4px 8px;
    outline: none;
    overflow: hidden;
    position: relative;

    &:focus, &:active {
      outline: 0 !important;
      background: ${theme.colors.gray[100]};
      box-shadow: inset 0 2px 4px 0 rgba(0, 0, 0, 0.06) !important;
    }

    ${isActive && css`
      background: ${theme.colors.gray[100]};
      box-shadow: inset 0 2px 4px 0 rgba(0, 0, 0, 0.06);

      &::before {
        content: '';
        top: 0;
        z-index: 200;
        bottom: 0;
        position: absolute;
        left: 0;
        height: 100%;
        width: 3px;
        background: ${theme.colors.primaryGradient};
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
