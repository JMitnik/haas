import styled, { css } from 'styled-components';
import { variant } from 'styled-system';
import Color from 'color';

type brandVariants = 'primary' | 'secondary' | 'warning' | 'error' | 'success' | 'default';
type sizeVariants = 'sm' | 'md' | 'lg';

interface SpanProps {
  brand?: brandVariants;
  size?: sizeVariants;
}

const Label = styled.span<SpanProps>`
  ${({ theme }) => css`
    border-radius: ${theme.borderRadiuses.lg};
    font-weight: 800;
    padding: ${theme.buttonSizes.sm};
  `}

  ${({ theme }) => variant({
    prop: 'brand',
    variants: {
      primary: {
        background: theme.colors.primary,
        color: Color(theme.colors.primary).darken(0.3).hex(),
      },
      secondary: {
        background: theme.colors.secondary,
        color: theme.colors.white,
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

export default Label;
