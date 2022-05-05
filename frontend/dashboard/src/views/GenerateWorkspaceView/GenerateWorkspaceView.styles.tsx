import * as RadixRadioGroup from '@radix-ui/react-radio-group';
import styled, { css } from 'styled-components';

export const RadioGroupIndicator = styled(RadixRadioGroup.Indicator)`
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

export const RadioGroupItem = styled(RadixRadioGroup.Item)`
  ${({ theme }) => css`
    width: 20px;
    height: 20px;
    border-radius: 100%;
    border: 1px solid ${theme.colors.off[200]};
    box-shadow: ${theme.boxShadows.sm};
  `}
`;

export const RadioGroupLabel = styled.span`
  display: block;
`;
export const RadioGroupSubtitle = styled.span`
  display: block;
`;

type RadioGroupBoxType = 'boxed' | 'unboxed';
type RadioGroupBoxContentType = 'oneLine' | 'twoLine';

interface RadioGroupBoxProps {
  isActive: boolean;
  contentVariant?: RadioGroupBoxContentType;
  variant?: RadioGroupBoxType;
}

export const RadioGroupBox = styled.label<RadioGroupBoxProps>`
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

      ${RadioGroupSubtitle}, ${RadioGroupLabel} {
        line-height: 1;
      }

      ${RadioGroupLabel} {
        font-size: 0.9rem;
        font-weight: 600;
        margin-bottom: ${theme.gutter / 4}px;
      }
    `}


    ${variant === 'unboxed' && css`
      padding: ${theme.gutter / 2}px 0;
    `}

    ${RadioGroupItem} {
      margin-right: ${theme.gutter / 2}px;
    }
  `}
`;

type RadioGroupType = 'tight' | 'joined' | 'spaced';

interface RadioGroupProps {
  variant?: RadioGroupType;
}

export const RadioGroupRoot = styled(RadixRadioGroup.Root) <RadioGroupProps>`
  ${({ theme, variant = 'tight' }) => css`

    ${variant === 'spaced' && css`
      display: grid;
      grid-gap: ${theme.gutter / 4}px;

      ${RadioGroupBox} {
        border-radius: ${theme.borderRadiuses.md}px;
      }
    `}

    ${variant === 'tight' && css`
      border-radius: ${theme.borderRadiuses.md}px;

      ${RadioGroupBox}:first-of-type {
        border-radius: ${theme.borderRadiuses.md}px ${theme.borderRadiuses.md}px 0 0;
      }

      ${RadioGroupBox}:last-of-type {
        border-radius: 0 0 ${theme.borderRadiuses.md}px ${theme.borderRadiuses.md}px;
      }
    `}
  `}
`;
