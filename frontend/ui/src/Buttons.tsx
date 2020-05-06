import styled, { css } from 'styled-components/macro';
import { variant, space, SpaceProps } from 'styled-system';
import Color from 'color';

type brandVariants = 'primary' | 'secondary' | 'warning' | 'error' | 'success' | 'default';
type sizeVariants = 'sm' | 'md' | 'lg';

export interface ButtonProps extends SpaceProps {
  isActive?: boolean;
  brand?: brandVariants;
  size?: sizeVariants;
}

export const EditDialogueContainer = styled.button`
margin-bottom: 20px;
margin-left: 2%;
border: none;
background: #f6f7f9;
padding: 5px;

svg {
  width: 15px;
  height: 15px;
}

opacity: 0.7;
cursor: pointer;
transition: all 0.2s ease-in;


`;

export const EditButtonContainer = styled.button`
position: absolute;
top: 10px;
right: 20px;
border: none;
background: #f6f7f9;
color: #a1a2a5;
padding: 5px;
border-radius: 100%;

svg {
  width: 10px;
  height: 10px;
}

opacity: 0.7;
cursor: pointer;
transition: all 0.2s ease-in;

&:hover {
  transition: all 0.2s ease-in;
  opacity: 0.9;
  background: #e1e2e5;
}
`;

export const DeleteButtonContainer = styled.button`
  position: absolute;
  top: 10px;
  right: 5px;
  border: none;
  background: #f6f7f9;
  color: #a1a2a5;
  padding: 5px;
  border-radius: 100%;

  svg {
    width: 10px;
    height: 10px;
  }

  opacity: 0.7;
  cursor: pointer;
  transition: all 0.2s ease-in;

  &:hover {
    transition: all 0.2s ease-in;
    opacity: 0.9;
    background: #e1e2e5;
  }
`;
export const ButtonIcon = styled.span``;

export const Button = styled.button<ButtonProps>`
  ${({ theme, isActive }) => css`
    padding: ${theme.buttonSizes.md};
    font-size: 1rem;
    font-weight: 600;
    border-radius: 50px;
    padding: 10px 24px;
    align-items: center;
    justify-content: center;
    display: flex;

    min-width: 150px;
    transition: all 0.1s ease-in;
    cursor: pointer;

    &:hover {
      transition: all 0.1s ease-in;
    }

    ${ButtonIcon} {
      display: inline-block;
      margin-right: 5px;
      vertical-align: middle;
    }

    h1, h2, h3, h4, h5 {
      margin: 0;
    }
  `}

  ${space}

  ${({ theme }) => variant({
    prop: 'brand',
    variants: {
      default: {
        background: theme.colors.default.normal,
        color: theme.colors.default.darkest,
        border: `1px solid ${theme.colors.default.normal}`,
        '&:hover': {
          background: Color(theme.colors.default.normal).lighten(0.05).hex(),
        },
      },
      primary: {
        background: Color(theme.colors.primary).darken(0.8).hex(),
        color: Color(theme.colors.primary).lighten(0.9).desaturate(0.3).hex(),
        border: `1px solid ${Color(theme.colors.primary).darken(0.2).hex()}`,
        '&:hover': {
          background: Color(theme.colors.primary).lighten(0.1).hex(),
        },
      },
      secondary: {
        background: Color(theme.colors.secondary).darken(0.6).hex(),
        color: Color(theme.colors.secondary).lighten(0.9).desaturate(0.3).hex(),
        border: `1px solid ${Color(theme.colors.secondary).darken(0.2).hex()}`,
        '&:hover': {
          background: Color(theme.colors.secondary).lighten(0.1).hex(),
        },
      },
      error: {
        background: theme.colors.error,
        color: Color(theme.colors.error).darken(0.5).hex(),
      },
      warning: {
        background: theme.colors.warning,
        color: Color(theme.colors.warning).darken(0.5).hex(),
      },
      success: {
        background: theme.colors.success,
        color: Color(theme.colors.success).darken(0.5).hex(),
      },
    },
  })}

  ${({ theme }) => variant({
    prop: 'size',
    variants: {
      sm: {
        padding: theme.buttonSizes.sm,
      },
      md: {
        padding: theme.buttonSizes.md,
      },
      lg: {
        padding: theme.buttonSizes.lg,
      },
    },
  })}
`;
