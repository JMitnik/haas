import * as RadixRadioGroup from '@radix-ui/react-radio-group';
import * as UI from '@haas/ui';
import React from 'react';
import styled, { css } from 'styled-components';

/**
 * Circular indicator of a radio group item
 */
export const Indicator = styled(RadixRadioGroup.Indicator)`
  ${({ theme }) => css`
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    position: relative;

    &::after {
      content: '';
      display: block;
      width: 11px;
      height: 11px;
      border-radius: 50%;
      background: ${theme.colors.main[500]};
    }
  `}
`;

/**
 * Container of the circular indicator
 */
export const ItemContainer = styled(RadixRadioGroup.Item)`
  ${({ theme }) => css`
    width: 20px;
    height: 20px;
    border-radius: 100%;
    border: 1px solid ${theme.colors.off[200]};
    box-shadow: ${theme.boxShadows.sm};
  `}
`;

/**
 * Main radio label
 */
export const Label = styled.span`
  display: block;
`;

/**
 * Main radio subtitle
 */
export const Subtitle = styled.span`
  display: block;
`;

/**
 * RadioGroup box
 */
type RadioGroupBoxType = 'boxed' | 'unboxed';
type RadioGroupBoxContentType = 'oneLine' | 'twoLine';

interface RadioGroupBoxProps {
  isActive: boolean;
  contentVariant?: RadioGroupBoxContentType;
  variant?: RadioGroupBoxType;
}

export const Box = styled.label<RadioGroupBoxProps>`
  ${({ theme, isActive, contentVariant = 'oneLine', variant = 'boxed' }) => css`
    display: flex;
    align-items: center;
    position: relative;
    color: ${theme.colors.off[600]};
    font-weight: 500;
    cursor: pointer;
    transition: all ${theme.transitions.normal};

    ${variant === 'boxed' && css`
      padding: ${theme.gutter / 2}px ${theme.gutter}px;
      background: white;
      border: 1px solid ${theme.colors.neutral[500]};
      box-shadow: ${theme.boxShadows.sm};

      ${isActive && css`
        transition: all ${theme.transitions.normal};
        background: ${theme.colors.main[50]};
        color: ${theme.colors.main[700]};
        border: 1px solid ${theme.colors.main[600]};
      `}
    `}

    ${contentVariant === 'oneLine' && css``}

    ${contentVariant === 'twoLine' && css`
      display: flex;
      align-items: flex-start;
      padding: ${theme.gutter / 1.5}px ${theme.gutter}px;

      ${Subtitle}, ${Label} {
        line-height: 1;
      }

      ${Label} {
        font-size: 0.9rem;
        font-weight: 600;
        margin-bottom: ${theme.gutter / 4}px;
      }
    `}

    ${variant === 'unboxed' && css`
      padding: ${theme.gutter / 2}px 0;
    `}

    ${ItemContainer} {
      margin-right: ${theme.gutter}px;
    }
  `}
`;

interface RadioGroupBoxItemProps extends RadioGroupBoxProps {
  children: React.ReactNode;
  value: string;
}

export const Item = ({ children, isActive, contentVariant, variant, value }: RadioGroupBoxItemProps) => (
  <Box
    htmlFor={value}
    key={value}
    isActive={isActive}
    contentVariant={contentVariant}
    variant={variant}
  >
    <ItemContainer id={value} key={value} value={value}>
      <Indicator />
    </ItemContainer>
    <UI.Div>
      {children}
    </UI.Div>
  </Box>
);

/**
 * Root of Radio group
 */
type RadioGroupType = 'tight' | 'joined' | 'spaced';

interface RadioGroupRootProps {
  variant?: RadioGroupType;
}

export const Root = styled(RadixRadioGroup.Root)<RadioGroupRootProps>`
  ${({ theme, variant = 'tight' }) => css`
    ${variant === 'spaced' && css`
      display: grid;
      grid-gap: ${theme.gutter / 4}px;

      ${Box} {
        border-radius: ${theme.borderRadiuses.md}px;
      }
    `}

    ${variant === 'tight' && css`
      border-radius: ${theme.borderRadiuses.md}px;

      ${Box}:first-of-type {
        border-radius: ${theme.borderRadiuses.md}px ${theme.borderRadiuses.md}px 0 0;
      }

      ${Box}:last-of-type {
        border-radius: 0 0 ${theme.borderRadiuses.md}px ${theme.borderRadiuses.md}px;
      }
    `}
  `}
`;
