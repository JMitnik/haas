import React from 'react'

import { useForm } from 'react-hook-form'
import { GridForm } from '../components/UI/GridForm'

import InputSectionView from './InputSectionView'
import styled, { css } from 'styled-components';
const ExampleInput = styled.input`
    grid-column-start: 1;
    grid-column-end: 3;
`

const DefaultLanguageSection = styled.div`
    grid-column-start: 1;
    grid-column-end: 3;    
`

const CheckBoxWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  
`;
const CheckBoxLabel = styled.label`
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
const CheckBox = styled.input`
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


export const MiniHeader = styled.h4`
  ${({ theme }) => css`
    grid-column-start: 1;
    grid-column-end: 3;
    padding: 10px;
    `
    }`;

const BasicTopicsForm = (props: any) => {
    const { register, handleSubmit, watch, errors } = useForm()
    const onSubmit = (data: any) => { console.log(data) }
    const options: Array<string> = ['English', 'Dutch', 'Russian', 'Chinese']
    console.log(watch('example')) // watch input value by passing the name of it

    return (
        <GridForm onSubmit={handleSubmit(onSubmit)}>
            <MiniHeader>BASIC TOPIC DETAILS</MiniHeader>
            {/* register your input into the hook by invoking the "register" function */}
            <CheckBoxWrapper>
                <CheckBox id="checkbox" type="checkbox" />
                <CheckBoxLabel htmlFor="checkbox"/>
                <h5>PRIVATE TOPIC</h5>
            </CheckBoxWrapper>
            <DefaultLanguageSection>
                <h5>DEFAULT LANGUAGE</h5>
                <select name="cars">
                    {options?.map((option, index) => (
                        <option value={option}>{option}</option>
                    ))}
                </select>
            </DefaultLanguageSection>

            <InputSectionView full={false} sub_title="TOPIC ALIAS NAME, USED AS IDENTIFIER" title="TOPIC NAME" />
            <InputSectionView full={false} sub_title="TOPIC URL PREVIEW" title="TOPIC URL NAME" />
            <InputSectionView full={true} sub_title="HOW DO YOU FEEL ABOUT" title="TOPIC DISPLAY NAME" />
            <InputSectionView full={true} sub_title="" title="TOPIC DESCRIPTION" />
            <InputSectionView full={true} sub_title="ADD AN EXTERNAL WEBSITE AS ADDITIONAL INFORMATION IF NEEDED" title="EXTERNAL DESCRIPTION URL" />
            {/* include validation with required or other standard HTML validation rules */}
            {/* <input name="exampleRequired" ref={register({ required: true })} /> */}
            {/* errors will return when field validation fails  */}
            {errors.exampleRequired && <span>This field is required</span>}
            {/* <ExampleInput name="example_input" defaultValue="test2" ref={register} /> */}
            <input type="submit" />
        </GridForm>
    )
};

export default BasicTopicsForm;