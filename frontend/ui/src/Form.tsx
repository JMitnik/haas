import React, { forwardRef, Ref, ReactNode } from 'react';
import 'antd/dist/antd.css'; // Slider,
import { Slider as AntdSlider } from 'antd';
import { Div, Paragraph } from '@haas/ui';
import {
  Button,
  FormControl as ChakraFormControl,
  FormLabel as ChakraFormLabel,
  Input as ChakraInput,
  InputGroup as ChakraInputGroup,
  InputLeftElement as ChakraInputLeftElement,
  InputRightElement as ChakraInputRightElement,
  InputLeftAddon as ChakraInputLeftAddOn,
  InputRightAddon as ChakraInputRightAddOn,
  InputProps as ChakraInputProps,
  InputGroupProps,
  FormControlProps,
  Textarea as ChakraTextArea,
  RadioButtonGroup as ChakraRadioButtonGroup} from '@chakra-ui/core';
import styled, { css } from 'styled-components';
import { SpaceProps, GridProps } from 'styled-system';
import { InputHTMLAttributes } from 'react';
import Color from 'color';
import { FormLabelProps } from '@chakra-ui/core/dist/FormLabel';
import { Grid } from './Container';
import { Text } from './Type';

export const FormContainer = styled(Div) <{expandedForm?: boolean}>`
  ${({ theme, expandedForm }) => css`
    padding-bottom: ${theme.gutter * 3}px;
    background: white;
    padding: ${theme.gutter}px;
    border-radius: 10px;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
    
    ${expandedForm && css`
      box-shadow: none;
    `}
  `}
`;

export const FormControl = forwardRef((props: FormControlProps, ref) => {
  const { children, ...restProps } = props

  return (
    <ChakraFormControl display="flex" flexDirection="column" ref={ref} {...restProps}>
      {children}
    </ChakraFormControl>
  )
});

export const FormGroupContainer = styled.div`
  ${({ theme }) => css`
      padding-bottom: ${theme.gutter * 3}px;
  `}
`;

export const InputHeader = styled(Text)`
  ${({ theme }) => css`
    color: ${theme.colors.gray[700]};
    margin-bottom: ${theme.gutter / 4}px;
  `}
`;

export const InputHelper = styled.p`
  ${({ theme }) => css`
    color: ${theme.colors.gray[500]};
    font-size: 0.8rem;
    margin-bottom: ${theme.gutter / 2}px;
    max-width: 500px;
  `}
`;

export const Form = styled.form``;

export const DeprecatedInputGroup = styled.div`
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
    color: ${Color(theme.colors.primary).mix(Color('white'), 0.8).hex()};
  `}
`;

export const FormLabel = forwardRef((props: FormLabelProps, ref) => (
  <ChakraFormLabel fontSize="0.8rem" color="gray.600" {...props} ref={ref} />
));

interface InputProps extends ChakraInputProps {
  leftEl?: ReactNode;
  rightEl?: ReactNode;
  leftAddOn?: ReactNode;
  rightAddOn?: ReactNode;
}

export const Textarea = forwardRef((props: ChakraInputProps<HTMLTextAreaElement>, ref: Ref<HTMLTextAreaElement>) => (
  <ChakraTextArea {...props} fontSize="0.8rem" ref={ref} />
));

export const Input = forwardRef((props: InputProps, ref: Ref<HTMLInputElement>) => (
  <InputGroup>
    {props.leftEl && (
      <ChakraInputLeftElement color="gray.400" padding="12px"  fontSize="0.5rem" {...props}>
        {props.leftEl}
      </ChakraInputLeftElement>
    )}

    {props.rightEl && (
      <ChakraInputRightElement width="auto" color="gray.400" padding="12px" fontSize="0.5rem" {...props}>
        {props.rightEl}
      </ChakraInputRightElement>
    )}

    {props.leftAddOn && (
      <ChakraInputLeftAddOn color="gray.400" padding="12px" fontSize="0.7rem" {...props}>
        {props.leftAddOn}
      </ChakraInputLeftAddOn>
    )}

    {props.rightAddOn && (
      <ChakraInputRightAddOn color="gray.400" padding="12px" fontSize="0.7rem" {...props}>
        {props.rightAddOn}
      </ChakraInputRightAddOn>
    )}

    <ChakraInput
      errorBorderColor="red.400"
      roundedBottomLeft={props.leftAddOn ? '0': 'auto'}
      roundedTopLeft={props.leftAddOn ? '0': 'auto'}
    {...props} fontSize="0.8rem" ref={ref} />
  </InputGroup>
));

export const InputGroup = forwardRef((props: InputGroupProps, ref) => (
  <ChakraInputGroup {...props} ref={ref} />
));

export const ErrorStyle = {
  control: (base: any) => ({
    ...base,
    border: '1px solid red',
    // This line disable the blue border
    boxShadow: 'none',
  }),
};

export const StyledInput = styled.input <{isInvalid?: boolean }>`
  ${({ theme, isInvalid }) => css`
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
    width: 100%;

    ${isInvalid && css`
    border: 1px solid red;
    outline: none;
    `}
  `}
`;

export const StyledTextInput = styled(Input).attrs({ as: 'textarea' })`
  resize: none;
  font-family: 'Open sans', sans-serif;
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

export const InputIconContainer = styled.div`
  position: relative;
`;

export const DeprecatedInputContainer = styled.div`
  display: flex;
  align-items: center;

  svg {
    margin-left: 12px;
  }
`;

const ButtonRadioContainer = styled.div`
  button {
    display: flex;
    align-items: flex-start;
  }

  button svg {
    vertical-align: baseline;
    margin-top: 6px;
  }

  button + div {
    margin-left: 4px;
  }
`;

interface RadioButtonProps {
  isChecked?: boolean;
  isDisabled?: boolean;
  value?: any;
  text?: string;
  description?: string;
  icon?: any;
}

export const RadioButton = forwardRef((props: RadioButtonProps, ref) => {
  const { isChecked, isDisabled, value, text, description, icon, ...rest } = props;

  return (
    <ButtonRadioContainer>
      <Button
        variant="outline"
        ref={ref}
        variantColor={isChecked ? 'blue' : 'gray'}
        aria-checked={isChecked}
        role="radio"
        display="block"
        textAlign="left"
        py="8px"
        leftIcon={icon}
        height="auto"
        isDisabled={isDisabled}
        {...rest}
      >
        <Div>
          <Paragraph color={!isChecked ? 'gray.600' : 'auto'} fontSize="0.9rem">{text}</Paragraph>
          <Paragraph color={!isChecked ? 'gray.500' : 'auto'} fontWeight={400} mt={2} fontSize="0.7rem">{description}</Paragraph>
        </Div>
    </Button>
    </ButtonRadioContainer>
  );
});


export const DeprecatedInputStyled = styled.input`
  ${({ theme }) => css`
    border: none;
    font-size: ${theme.fontSizes[1]}px;
    border-radius: 0 10px 10px 0;
    padding: 12px 24px;
    background: white;
    text-align: center;
    font-weight: bolder;
    color: ${theme.colors.default.text};
    text-align: left;
    margin-left: ${theme.gutter / 2}px;

    &::placeholder {
      color: #c6c6c6;
      font-weight: 500;
    }

    &:focus, &:active {
      background: ${Color(theme.colors.primary).mix(Color('white'), 0.9).hex()};
      outline: none !important;
    }
  `}
`;

export const Textbox = styled.textarea`
  ${({ theme }) => css`
    border: none;
    
    font-size: ${theme.fontSizes[1]}px;
    border-radius: 10px;
    font-family: 'Open Sans', sans-serif;
    box-shadow: none;
    padding: 24px 24px;
    min-height: 200px;
    width: 100%;
    resize: none;

    &::placeholder {
      color: #e6ecf4;
    }

    &:focus {
      outline: none;
    }
  `}
`;

export const SliderContainer = styled.div`
  ${() => css`

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

export const FormSectionContainer = styled(Grid)`
  ${({ theme }) => css`
    & + & {
      
    }
  `}
`;

interface FormSectionProps extends GridProps {
  children: React.ReactNode; 
  id?: string;
}

export const FormSection = forwardRef((props: FormSectionProps, ref: Ref<HTMLDivElement>) => (
  <FormSectionContainer ref={ref} py={4} gridTemplateColumns={['1fr', '1fr', '1fr', '1fr 3fr']} {...props}>
    {props.children}
  </FormSectionContainer>
));

export const FormSectionHeader = styled(Text)`
  ${({ theme }) => css`
    font-size: 1.3rem;
    color: ${theme.colors.default.text};
    font-weight: 700;
    margin-bottom: ${theme.gutter / 4}px;
  `}
`;

export const FormSectionHelper = styled(Text)`
  ${({ theme }) => css`
    font-size: 0.9rem;
    color: ${theme.colors.gray[500]};
    font-weight: 400;
  `}
`;

interface InputGridProps extends GridProps {
  children: React.ReactNode;
}

interface RadioButtonsProps {
  children: React.ReactNode;
  onChange: any;
  value: any;
  onBlur: any
}

export const RadioButtons = ({ children, onChange, value, onBlur }: RadioButtonsProps) => (
  <ChakraRadioButtonGroup display="flex" flexWrap="wrap" onChange={onChange} value={value} onBlur={onBlur}>
    {children}
  </ChakraRadioButtonGroup>
)

export const InputGrid = forwardRef((props: InputGridProps, ref: Ref<HTMLDivElement>) => (
  <Grid mb={4} gridTemplateColumns={['1fr', '1fr', '1fr']} {...props}>
    {props.children}
  </Grid>
));

interface CardFormProps {
  dualPane?: boolean;
}

export const CardForm = styled(Div)<CardFormProps>`
  ${({ theme, dualPane }) => css`
    ${dualPane && css`
      display: flex;

      > *:first-child {
        border-right: 1px solid ${theme.colors.gray[200]};
      }
    `}
  `}
`;

export const GridForm = styled.form`
  ${() => css`
    display: grid;
    row-gap: 20px;
    column-gap: 10px;
    box-shadow: 0 1px 3px rgba(0,0,0,0.1);
    padding: 10px;
  `}
`;

interface RangeSliderProps {
  min: number;
  max: number;
  isDisabled?: boolean;
  stepSize?: number;
  onChange?: (vals: [number, number] | number) => void;
}

export const RangeSlider = ({ min=0, max=10, onChange, stepSize=0.5, isDisabled = false }: RangeSliderProps) => {
  return (
    <AntdSlider 
      range
      disabled={isDisabled}
      max={10}
      min={0}
      step={stepSize}
      defaultValue={[min, max]}
      onAfterChange={onChange}
    />
  )
};