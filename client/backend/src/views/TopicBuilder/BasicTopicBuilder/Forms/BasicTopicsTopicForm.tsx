import React from 'react';

import { useForm } from 'react-hook-form';
import styled from 'styled-components';
import { CheckBoxWrapper, CheckBox, CheckBoxLabel, GridForm } from '../../../../components/UI/Form';
import InputSectionView from './NameInputForm';
import { H4 } from '../../../../components/UI/Type';

const DefaultLanguageSection = styled.div`
    grid-column-start: 1;
    grid-column-end: 3;
`;

export const MiniHeader = styled(H4)`
    grid-column-start: 1;
    grid-column-end: 3;
`;

const BasicTopicsTopicForm = () => {
  const { handleSubmit, errors } = useForm();
  const onSubmit = (data: any) => { console.log(data); };
  const options: Array<string> = ['English', 'Dutch', 'Russian', 'Chinese'];

  return (
    <GridForm onSubmit={handleSubmit(onSubmit)}>
      <MiniHeader py={2}>BASIC TOPIC DETAILS</MiniHeader>

      <CheckBoxWrapper>
        <CheckBox id="checkbox" type="checkbox" />
        <CheckBoxLabel htmlFor="checkbox" />
        <h5>PRIVATE TOPIC</h5>
      </CheckBoxWrapper>

      <DefaultLanguageSection>
        <h5>DEFAULT LANGUAGE</h5>
        <select name="cars">
          {options?.map((option) => (
            <option value={option}>{option}</option>
          ))}
        </select>
      </DefaultLanguageSection>

      <InputSectionView
        full={false}
        sub_title="TOPIC ALIAS NAME, USED AS IDENTIFIER"
        title="TOPIC NAME"
      />
      <InputSectionView full={false} sub_title="TOPIC URL PREVIEW" title="TOPIC URL NAME" />
      <InputSectionView full sub_title="HOW DO YOU FEEL ABOUT" title="TOPIC DISPLAY NAME" />
      <InputSectionView full sub_title="" title="TOPIC DESCRIPTION" />
      <InputSectionView
        full
        sub_title="ADD AN EXTERNAL WEBSITE AS ADDITIONAL INFORMATION IF NEEDED"
        title="EXTERNAL DESCRIPTION URL"
      />
      {/* include validation with required or other standard HTML validation rules */}
      {/* <input name="exampleRequired" ref={register({ required: true })} /> */}
      {/* errors will return when field validation fails  */}
      {errors.exampleRequired && <span>This field is required</span>}
      {/* <ExampleInput name="example_input" defaultValue="test2" ref={register} /> */}
      <input type="submit" />
    </GridForm>
  );
};

export default BasicTopicsTopicForm;
