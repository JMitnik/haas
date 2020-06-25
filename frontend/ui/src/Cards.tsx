import styled, { css } from 'styled-components/macro';
import { Div } from './Generics';

export const Card = styled(Div)`
  ${({ theme }) => css`
    position: relative;
    box-shadow: 0 1px 2px 0 rgba(0,0,0,.05);
    border-radius: ${theme.borderRadiuses.somewhatRounded};
    /* color: ${theme.colors.default.darkest}; */
    border: 1px solid #fcfcfc;
    cursor: pointer;

    &:hover {
      transition: all .3s cubic-bezier(.55,0,.1,1);
      box-shadow: 0 4px 6px -1px rgba(0,0,0,.1),0 2px 4px -1px rgba(0,0,0,.06)!important;
    }
  `}
`;

export const AddCard = styled(Card)`
  ${({ theme }) => css`
    position: relative;
    box-shadow: none;
    border-radius: ${theme.borderRadiuses.md}

    &:hover ${Div} {
      transition: all 0.2s ease-in;
      box-shadow: 0 1px 3px 1px rgba(0,0,0,0.2) !important;
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

export const CardBody = styled(Div)`
  ${({ theme }) => css`
    padding: ${theme.gutter * 0.75}px;
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
