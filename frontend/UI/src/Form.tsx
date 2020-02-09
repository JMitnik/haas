import React, { forwardRef, Ref } from 'react';
import styled, { css } from 'styled-components';
import { SpaceProps } from 'styled-system';
import { InputHTMLAttributes } from 'react';
import Color from 'color';

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

        background-image: url('./logo-haas.png');
        background-size: contain;
        background-repeat: no-repeat;
        cursor: pointer;
        position: relative;
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
