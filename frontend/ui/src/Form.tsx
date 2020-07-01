import React, { forwardRef, Ref } from 'react';
import { Div } from '@haas/ui';
import styled, { css } from 'styled-components';
import { SpaceProps } from 'styled-system';
import { InputHTMLAttributes } from 'react';
import Color from 'color';
import { Flex } from './Container';

export const FormGroupContainer = styled.div`
  ${({ theme }) => css`
    padding-bottom: ${theme.gutter * 3}px;
  `}
`;

export const Form = styled.form``;

export const InputGroup = styled.div`
  ${({ theme }) => css`

    ${DeprecatedInputStyled} {
      border: none;
    }

    ${DeprecatedInputContainer} {
      background: white;
      align-items: center;
      border-radius: 10px;

      &:focus {
        background: red;
      }

      svg {
        stroke: #dcdcdc;
        margin-left: ${theme.gutter / 2}px;
      }
    }
  `}
`;

export const InputLabel = styled.label`
  ${({ theme }) => css`
    font-size: ${theme.fontSizes[2]}px;
    margin: 0;
    margin-bottom: ${theme.gutter / 3}px;
    padding-left: ${theme.gutter / 2}px;
    text-align: left;
    display: block;
    /* TODO: Hard-coded, needs to be determiend */
    color: white;
  `}
`;

export const StyledLabel = styled(Div).attrs({ as: 'label' })`
  ${({ theme }) => css`
    font-size: 0.8rem;
    font-weight: bold;
    margin-bottom: 2px;
    display: inline-block;
    color: ${theme.colors.default.dark}
    text-transform: uppercase;
  `}
`;

export const StyledInput = styled.input`
  ${({ theme }) => css`
    border-radius: ${theme.borderRadiuses.sm};
    background: ${theme.colors.white};
    border: none;
    border-bottom: ${theme.colors.default.normal} 1px solid;
    box-shadow: none;
    background: white;
    border-radius: 3px;

    /* Make somehow a color */
    border: 1px solid #dbdde0;
    box-shadow: none;

    /* Set to variable */
    padding: 15px;
  `}
`;

export const StyledTextInput = styled(StyledInput).attrs({ as: 'textarea' })`
  resize: none;
  min-height: 150px;
`;

export const CheckBoxWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

export const CheckBoxLabel = styled.label`
  position: absolute;
  top: 0;
  left: 0;
  width: 42px;
  height: 26px;
  border-radius: 15px;
  background: #bebebe;
  cursor: pointer;

  &::after {
    content: "";
    display: block;
    border-radius: 50%;
    width: 18px;
    height: 18px;
    margin: 3px;
    background: #ffffff;
    box-shadow: 1px 3px 3px 1px rgba(0, 0, 0, 0.2);
    transition: 0.2s;
  }
`;

export const CheckBox = styled.input`
  opacity: 0;
  z-index: 1;
  border-radius: 15px;
  width: 42px;
  height: 26px;

  &:checked + ${CheckBoxLabel} {
    background: #3847B2;

    &::after {
      content: "";
      display: block;
      border-radius: 50%;
      width: 18px;
      height: 18px;
      margin-left: 21px;
      transition: 0.2s;
    }
  }
`;

type SliderProps = InputHTMLAttributes<HTMLInputElement> | SpaceProps;

export const Slider = forwardRef((props: SliderProps, ref: Ref<HTMLInputElement>) => (
  <SliderContainer>
    <input {...props} ref={ref} type="range"/>
  </SliderContainer>
));


interface InputFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  icon?: React.ReactNode;
  children?: React.ReactNode;
}


export const InputIconContainer = styled.div`
  position: relative;
`;

export const InputFieldContainer = styled.div`
  ${({ theme }) => css`
    position: relative;
    background: inherit;
    border-radius: ${theme.borderRadiuses.rounded};
    fill: currentColor;

    ${InputIconContainer} {
      width: ${theme.gutter * 0.75}px;
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      margin-left: ${theme.gutter * 0.5}px;

      /* Edge case: in case icon search */
      .icon-search .primary {
        fill: none;
      }
    }

    ${InputIconContainer} + ${StyledInput} {
      margin-left: ${theme.gutter}px;
    }
  `}
`;

export const InputField = ({ icon, children, ...props }: InputFieldProps) => (
  <InputFieldContainer>
    {icon && (
      <InputIconContainer>
        {icon}
      </InputIconContainer>
    )}

    <StyledInput {...props} />
  </InputFieldContainer>
)

export const DeprecatedInputContainer = styled.div`
  display: flex;
  align-items: center;

  svg {
    margin-left: 12px;
  }
`;


export const DeprecatedInputStyled = styled.input`
  ${({ theme }) => css`
    border: none;
    font-size: ${theme.fontSizes[1]}px;
    border-radius: 10px;
    padding: 12px 24px;
    background: white;
    text-align: center;
    font-weight: bolder;
    color: ${theme.colors.default.text};
    text-align: left;

    &::placeholder {
      color: #c6c6c6;
      font-weight: 500;
    }

    &:focus, &:active {
      border: 1px solid #0059f8;
      background: ${Color('#0059f8').mix(Color('white'), 0.9).hex()};
      box-shadow: 0 0 0 4px ${Color('#0059f8').fade(0.8).string()};
      outline: none !important;
    }
  `}
`;

export const Textbox = styled.textarea`
  ${({ theme }) => css`
    border: none;
    font-size: ${theme.fontSizes[1]}px;
    border-radius: 20px;
    box-shadow: none;
    padding: 24px 24px;
    min-height: 200px;
    width: 100%;
    resize: none;

    &:focus {
      outline: none;
    }
  `}
`;

export const SliderContainer = styled.div`
  ${({ theme }) => css`

    /* TODO: Ensure that size is defined by a variable */
    input[type=range] {
      /* Style the input */
      & {
        -webkit-appearance: none; /* Hides the slider so that custom slider can be made */
        width: 100%; /* Specific width is required for Firefox. */
        background: transparent; /* Otherwise white in Chrome */
      }

      &:focus {
        outline: none;
      }

      &::ms-track {
        /* Hides the slider so custom styles can be added */
        width: 100%;
        cursor: pointer;
        background: transparent;
        border-color: transparent;
        color: transparent;
      }

      /* Style the thumb */
      /* TODO: Enable styles for firefox and IE*/
      &::-webkit-slider-thumb {
        -webkit-appearance: none;
        height: 80px;
        opacity: 0;
        width: 80px;
        background: transparent;
        border-color: transparent;
        border: none;
        background-color: transparent;

        /* Ensure that the bunny is on top of the bar */
        transform: translateY(-100%);
        cursor: pointer;
        position: relative;

        &:hover {
          background-color: transparent;
        }
      }

      /* Style the thumb */
      /* TODO: Enable styles for firefox and IE*/
      &::-moz-range-thumb {
        -webkit-appearance: none;
        height: 80px;
        width: 80px;
        opacity: 0;

        /* Ensure that the bunny is on top of the bar */
        transform: translateY(-100%);
        border: none;
        background-color: transparent;
        background: transparent;
        border-color: transparent;
        background-size: contain;
        background-repeat: no-repeat;
        cursor: pointer;
        position: relative;

        &:hover {
          background-color: transparent;
        }
      }

      /* Style the thumb */
      /* TODO: Enable styles for firefox and IE*/
      &::-ms-thumb {
        -webkit-appearance: none;
        height: 80px;
        width: 80px;
        opacity: 0;

        /* Ensure that the bunny is on top of the bar */
        transform: translateY(-100%);
        border: none;
        border-color: transparent;
        background-color: transparent;
        background-size: contain;
        background-repeat: no-repeat;
        cursor: pointer;
        position: relative;

        &:hover {
          background-color: transparent;
          border-color: transparent;
        }
      }

      &::-moz-range-track {
        width: 100%;
        margin-top: 80px;
        height: 15px;
        cursor: pointer;
        width: 100%;
        box-shadow: 0px 2px 2px 1px rgba(0,0,0,0.05);
        background: linear-gradient(45deg, rgba(0, 0, 0, 0.15), rgba(0, 0, 0, 0.04));
        border-radius: 10px;
      }

      &::-webkit-slider-runnable-track {
        width: 100%;
        margin-top: 80px;
        height: 15px;
        cursor: pointer;
        width: 100%;
        box-shadow: 0px 2px 2px 1px rgba(0,0,0,0.05);
        background: linear-gradient(45deg, rgba(0, 0, 0, 0.15), rgba(0, 0, 0, 0.04));
        border-radius: 10px;
      }
    }
  `}
`;

export const GridForm = styled.form`
  ${({ theme }) => css`
    display: grid;
    row-gap: 20px;
    column-gap: 10px;
    box-shadow: 0 1px 3px rgba(0,0,0,0.1);
    padding: 10px;
  `}
`;
