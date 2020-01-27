import styled, { css } from 'styled-components';
import { variant, space, SpaceProps } from 'styled-system';
import Color from 'color';

type brandVariants = 'primary' | 'secondary' | 'warning' | 'error' | 'success' | 'default';
type sizeVariants = 'sm' | 'md' | 'lg';

export interface ButtonProps extends SpaceProps {
  brand?: brandVariants;
  size?: sizeVariants;
}

export const Button = styled.button<ButtonProps>`
  ${({ theme }) => css`
    border-radius: ${theme.borderRadiuses.md};
    padding: ${theme.buttonSizes.md};
    font-size: 1rem;
    font-weight: 600;
    transition: all 0.1s ease-in;
    cursor: pointer;

    &:hover {
      transition: all 0.1s ease-in;
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
        background: theme.colors.primary,
        color: theme.colors.white,
        '&:hover': {
          background: Color(theme.colors.primary).lighten(0.1).hex(),
        },
      },
      secondary: {
        background: theme.colors.secondary,
        color: Color(theme.colors.secondary).darken(0.5).hex(),
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
