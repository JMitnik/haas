import React, { forwardRef, Ref, ReactNode, useState, useEffect, useRef } from 'react';
import 'antd/dist/antd.css'; // Slider,
import 'easymde/dist/easymde.min.css'; // Markdown
import AntdDatePickerGenerate from 'rc-picker/lib/generate/dateFns';
import generatePicker from 'antd/lib/date-picker/generatePicker';
import {
  Slider as AntdSlider,
  // DatePicker as AntdDatepicker,
} from 'antd';
import { Div, Paragraph, SectionHeader, Strong } from '@haas/ui';
import SimpleMDE from 'react-simplemde-editor';
import {
  Checkbox as ChakraCheckbox,
  CheckboxProps as ChakraCheckboxProps,
  ButtonProps as ChakraButtonProps,
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
  Switch as ChakraSwitch,
  Textarea as ChakraTextArea,
  RadioButtonGroup as ChakraRadioButtonGroup,
  SwitchProps,
} from '@chakra-ui/core';
import styled, { css } from 'styled-components';
import { SpaceProps, GridProps } from 'styled-system';
import ReactSelect from 'react-select';
import { InputHTMLAttributes } from 'react';
import Color from 'color';
import { FormLabelProps } from '@chakra-ui/core/dist/FormLabel';
import { Grid, Stack } from './Container';
import { Text } from './Type';

const AntdDatepicker = generatePicker<Date>(AntdDatePickerGenerate);
const { RangePicker: AntdRangePicker } = AntdDatepicker;

interface FormContainerProps {
  expandedForm?: boolean;
}

export const FormContainer = styled(Div) <FormContainerProps>`
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

export const Checkbox = (props: ChakraCheckboxProps) => <ChakraCheckbox {...props} color="red" />;

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
    white-space: pre-wrap;
  `}
`;

export const FormLabelHelper = InputHelper;

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
  <ChakraFormLabel fontSize="0.9rem" color="gray.600" fontWeight="600" {...props} ref={ref} />
));

interface InputProps extends ChakraInputProps {
  leftEl?: ReactNode;
  rightEl?: ReactNode;
  leftAddOn?: ReactNode;
  rightAddOn?: ReactNode;
}

export const Textarea = forwardRef(
  (props: ChakraInputProps<HTMLTextAreaElement>, ref: Ref<HTMLTextAreaElement>) => (
    <ChakraTextArea {...props} fontSize="0.8rem" ref={ref} />
  )
);

export const Input = forwardRef(({ id, ...props }: InputProps, ref: Ref<HTMLInputElement>) => (
  <InputGroup>
    {props.leftEl && (
      <ChakraInputLeftElement color="gray.400" padding="12px" fontSize="0.5rem" {...props}>
        {props.leftEl}
      </ChakraInputLeftElement>
    )}

    {props.rightEl && (
      <ChakraInputRightElement
        width="auto"
        color="gray.400"
        padding="12px"
        fontSize="0.5rem"
        {...props}
      >
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
      roundedBottomLeft={props.leftAddOn ? '0' : 'auto'}
      roundedTopLeft={props.leftAddOn ? '0' : 'auto'}
      roundedBottomRight={props.rightAddOn ? '0' : 'auto'}
      roundedTopRight={props.rightAddOn ? '0' : 'auto'}
      id={id}
      {...props}
      fontSize="0.8rem"
      ref={ref}
    />
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

export const ErrorMessage = styled(Text)`
  ${({ theme }) => css`
    color: ${theme.colors.red[400]};
    font-weight: 600;
    line-height: 1rem;
    font-size: 0.8rem;
    letter-spacing: 0.05em;
    margin-top: 12px;
  `}
`;

export const StyledInput = styled.input<{ isInvalid?: boolean }>`
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

    ${isInvalid &&
    css`
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


type SliderProps = InputHTMLAttributes<HTMLInputElement> | SpaceProps;

export const Slider = forwardRef((props: SliderProps, ref: Ref<HTMLInputElement>) => (
  <SliderContainer>
    <input {...props} ref={ref} type="range" />
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
  mr?: any;
  ml?: any;
  mb?: any;
  mt?: any;
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
          <Paragraph color={!isChecked ? 'gray.600' : 'auto'} fontSize="0.9rem">
            {text}
          </Paragraph>
          <Paragraph
            color={!isChecked ? 'gray.500' : 'auto'}
            fontWeight={400}
            mt={2}
            fontSize="0.7rem"
          >
            {description}
          </Paragraph>
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

    &:focus,
    &:active {
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
    input[type='range'] {
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
        box-shadow: 0px 2px 2px 1px rgba(0, 0, 0, 0.05);
        background: linear-gradient(45deg, rgba(0, 0, 0, 0.15), rgba(0, 0, 0, 0.04));
        border-radius: 10px;
      }

      &::-webkit-slider-runnable-track {
        width: 100%;
        margin-top: 80px;
        height: 15px;
        cursor: pointer;
        width: 100%;
        box-shadow: 0px 2px 2px 1px rgba(0, 0, 0, 0.05);
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
  <FormSectionContainer
    ref={ref}
    py={4}
    gridTemplateColumns={['1fr', '1fr', '1fr', '1fr', '1fr 3fr']}
    {...props}
  >
    {props.children}
  </FormSectionContainer>
));

export const FormSectionHeader = styled(SectionHeader)``;

export const RadioHeader = styled(Strong)`
  ${({ theme }) => css`
    padding-bottom: ${theme.gutter / 2}px;
    margin-bottom: ${theme.gutter / 2}px;
    border-bottom: 1px solid ${theme.colors.gray[200]};
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
  defaultValue?: any;
  onBlur: any;
}

export const RadioButtons = forwardRef(({ children, onChange, value, defaultValue, onBlur }: RadioButtonsProps, ref) => (
  <ChakraRadioButtonGroup
    display="flex"
    flexWrap="wrap"
    onChange={onChange}
    defaultValue={defaultValue}
    value={value}
    ref={ref}
    isInline
    spacing={2}
    onBlur={onBlur}
  >
    {children}
  </ChakraRadioButtonGroup>
));

export const InputGrid = (props: InputGridProps) => (
  <Grid gridTemplateColumns={['1fr', '1fr', '1fr']} {...props}>
    {props.children}
  </Grid>
);

interface CardFormProps {
  dualPane?: boolean;
}

export const CardForm = styled(Div) <CardFormProps>`
  ${({ theme, dualPane }) => css`
    ${dualPane &&
    css`
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
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    padding: 10px;
  `}
`;

interface RangeSliderProps {
  min: number;
  max: number;
  isDisabled?: boolean;
  stepSize?: number;
  onChange?: (vals: [number, number] | number) => void;
  defaultValue?: number[]
}

interface FormSliderProps {
  defaultValue?: number;
  isDisabled?: boolean;
  stepSize?: number;
  min?: number;
  max?: number;
  onChange?: (vals: [number, number] | number) => void;
}

export const FormSlider = ({
  defaultValue,
  onChange,
  stepSize = 0.5,
  isDisabled = false,
  min,
  max
}: FormSliderProps) => {
  return (
    <AntdSlider
      min={min}
      max={max}
      disabled={isDisabled}
      step={stepSize}
      defaultValue={defaultValue}
      onAfterChange={onChange}
    />
  );
}

export const RangeSlider = ({
  min = 0,
  max = 10,
  onChange,
  stepSize = 0.5,
  isDisabled = false,
  defaultValue
}: RangeSliderProps) => {
  return (
    <AntdSlider
      range
      disabled={isDisabled}
      max={max}
      min={min}
      step={stepSize}
      defaultValue={defaultValue?.length ? [defaultValue[0], defaultValue[1]] : [min, max]}
      onAfterChange={onChange}
    />
  );
};

interface MarkdownEditorOptions {
  hideStatus?: boolean;
  maxHeight?: number;
}

const defaultMarkdownEditorOptions: MarkdownEditorOptions = {
  hideStatus: true,
  maxHeight: 130,
}

interface MarkdownEditorProps {
  value: string;
  onChange: (val: string) => void;
  options?: MarkdownEditorOptions;
}

export const MarkdownEditorContainer = styled(Div)`
  ${({ theme }) => css`
    .EasyMDEContainer {
      border-radius: 5px;
      background: white;
    }

    .editor-toolbar {
      background: white;
      border-radius: 5px 5px 0 0;
      border: 1px solid ${theme.colors.gray[300]};
      border-width: 1px 1px 0 1px;
    }

    .CodeMirror {
      border: 1px solid ${theme.colors.gray[300]};
      border-radius: 0 0 5px 5px;
      font-family: 'Inter', sans-serif;
    }

    .editor-statusbar {
      display: none;
    }
  `}
`;

export const MarkdownEditor = ({ value, onChange, options = defaultMarkdownEditorOptions }: MarkdownEditorProps) => (
  <MarkdownEditorContainer>
    <SimpleMDE
      value={value}
      onChange={onChange}
      options={{
        status: options.hideStatus,
        maxHeight: `${options.maxHeight}px`,
        toolbar: ['bold', 'italic', 'preview'],
      }}
    />
  </MarkdownEditorContainer>
)

interface TimePickerProps {
  minuteStep?: number;
  hourStep?: number;
  format?: string;
  secondStep?: number;
};

interface RangeProps {
  ranges: any;
}

interface RangePickerProps {
  range: RangeProps;
  format?: string;
  value?: [Date | undefined | null, Date | undefined | null];
  defaultValue?: [Date, Date];
  onChange: (dates: any, dateStrings: string[]) => void;
  showTime?: boolean | TimePickerProps;
}

interface PureDatePickerProps {
  range?: any;
  format?: string;
  defaultValue?: Date;
  onChange: (date: any, dateString: string) => void;
  showTime?: boolean | TimePickerProps;
}

export const DatePickerContainer = styled.div`
  ${({ theme }) => css`
    z-index: 500;

    .ant-picker-range {
      border-radius: 10px;
      box-shadow: 0 4px 6px rgba(50,50,93,.11), 0 1px 3px rgba(0,0,0,.08);
      border: none;
      padding: 10px 14px;
    }

    .ant-picker-input input {
      font-weight: 600;
      line-height: 1rem;
      font-size: 0.8rem;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: ${theme.colors.gray[500]};
    }

    .ant-picker-panel-container {
      border-radius: 10px;
    }
  `}
`;

export const PureDatePickerWrapper = (props: PureDatePickerProps) => (
  <AntdDatepicker
    // @ts-ignore
    getPopupContainer={triggerNode => triggerNode.parentNode}
    {...props}
  />
);

const useDebouncedEffect = (
  callback: () => any, delay = 250, dependencies?: any[],
) => useEffect(() => {
  const timer = setTimeout(callback, delay);

  return () => {
    clearTimeout(timer);
  };
}, dependencies);

export const DebouncedInput = ({ value, onChange }: { value: any, onChange: (val: any) => void }) => {
  const [localValue, setLocalValue] = useState();
  const startedRef = useRef<boolean>();

  useDebouncedEffect(() => {
    if (startedRef.current) {
      onChange(localValue);
      startedRef.current = false;
    }
  }, 500, [localValue]);

  useEffect(() => {
    if (value !== localValue && !startedRef.current) {
      setLocalValue(value);
    }
  }, [value]);

  return (
    <Input
      value={localValue}
      width={40}
      // @ts-ignore
      onChange={(e) => { startedRef.current = true; setLocalValue(e.target.value) }}
    />
  )
}

export const RangeDatePickerWrapper = (props: RangePickerProps) => (
  <AntdRangePicker
    // @ts-ignore
    getPopupContainer={triggerNode => triggerNode.parentNode}
    {...props} />
);

export const DatePicker = ({ range, ...restProps }: RangePickerProps | PureDatePickerProps) => (
  <DatePickerContainer>
    {range !== undefined ? (
      <RangeDatePickerWrapper
        {...range}
        format={'dd-MM-yyyy'}
        {...restProps as RangePickerProps}
      />
    ) : (
      <PureDatePickerWrapper
        {...restProps as PureDatePickerProps}
        format={'dd-MM-yyyy'}
      />
    )}
  </DatePickerContainer>
);

export const Switch = styled.div`
  ${({ theme }) => css`
    display: flex;
    flex-wrap: wrap;
    background: ${theme.colors.gray[100]};
    padding: 4px;
    border-radius: 10px;
    box-shadow: inset 0 2px 4px 0 rgb(0 0 0 / 5%);
  `}
`;

interface SwitchItemProps {
  isActive?: boolean;
}

export const SwitchItem = styled.button.attrs({ type: 'button' }) <SwitchItemProps>`
  ${({ theme, isActive }) => css`
    color: ${theme.colors.gray[700]};
    font-weight: 700;
    padding: 4px 8px;
    border-radius: 10px;

    & + & {
      margin-left: ${theme.gutter / 2}px;
    }

    &:active, &:focus {
      outline: none;
    }

    ${isActive && css`
      background: white;
      color: ${theme.colors.gray[600]};
      box-shadow: 0 4px 6px rgba(50,50,93,.11), 0 1px 3px rgba(0,0,0,.08);
    `}
  `}
`

export const Toggle = forwardRef((props: SwitchProps, ref) => {
  const { children, ...restProps } = props;

  return (
    <ChakraSwitch ref={ref} color="teal" {...restProps}>
      {children}
    </ChakraSwitch>
  );
});

type ReactSelectProps = ReactSelect<any>['props'];

interface SelectContainerProps {
  menuIsOpen?: boolean;
}

export const SelectContainer = styled(Div) <SelectContainerProps>`
  ${({ theme, menuIsOpen }) => css`
    ${menuIsOpen && css`
        .select__control {
          margin-bottom: ${theme.gutter / 2}px;
          border-radius: 10px;
        }

        .select__indicator {
          display: none;
        }

        .select__indicator-separator {
          display: none;
        }

        .select__option {
          &:hover {
            cursor: pointer;
          }
        }

        .select__menu {
          background: white;
          /* Apply breakout */
          margin: 0 -${theme.gutter / 2}px;
          margin-bottom: -${theme.gutter / 2}px;
          border-top: 1px solid ${theme.colors.gray[200]};
        }
    `}
  `}
`;

export const Select = (props: ReactSelectProps) => (
  <SelectContainer menuIsOpen={props.menuIsOpen}>
    <ReactSelect {...props} classNamePrefix="select" />
  </SelectContainer>
);

export const FormControl = forwardRef((props: FormControlProps, ref) => {
  const { children, ...restProps } = props;

  return (
    <ChakraFormControl display="flex" flexDirection="column" ref={ref} {...restProps}>
      {children}
    </ChakraFormControl>
  );
});
