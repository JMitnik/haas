import React, { forwardRef, Ref } from 'react';
import { Div } from '@haas/ui';
import styled, { css } from 'styled-components';
import { SpaceProps } from 'styled-system';
import { InputHTMLAttributes } from 'react';
import Color from 'color';


export const InputGroup = styled.div`
`;

export const InputLabel = styled.label`
  ${({ theme }) => css`
    font-size: ${theme.fontSizes[2]}px;
    margin: 0;
    margin-bottom: ${theme.gutter / 3}px;
    padding-left: ${theme.gutter}px;
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

export const InputField = styled.input`
  ${({ theme }) => css`
      border: none;
      font-size: ${theme.fontSizes[1]}px;
      border-radius: 50px;
      padding: 12px 24px;
      background: white;
      text-align: center;
      font-weight: bolder;
      color: ${theme.colors.default.text};
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
        width: 80px;

        /* Ensure that the bunny is on top of the bar */
        transform: translateY(-100%);

        border: none;
        background-color: transparent;
        background-image: url('/logo-haas.svg');
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
      &::-moz-range-thumb {
        -webkit-appearance: none;
        height: 80px;
        width: 80px;

        /* Ensure that the bunny is on top of the bar */
        transform: translateY(-100%);
        border: none;
        background-color: transparent;
        background-image: url('/logo-haas.svg');
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

        /* Ensure that the bunny is on top of the bar */
        transform: translateY(-100%);
        border: none;
        background-color: transparent;
        background-image: url('/logo-haas.svg');
        background-size: contain;
        background-repeat: no-repeat;
        cursor: pointer;
        position: relative;

        &:hover {
          background-color: transparent;
        }
      }

      &::-webkit-slider-runnable-track {
        width: 100%;
        margin-top: 80px;
        height: 10px;
        cursor: pointer;
        box-shadow: 1px 1px 1px #000000, 0px 0px 1px #0d0d0d;
        background: ${Color(theme.colors.primary).darken(0.4).hex()};
        border-radius: 10px;
        border: 0.2px solid #010101;
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
