import React from 'react';

import { useForm } from 'react-hook-form';
import styled from 'styled-components';
import { GridForm } from '../components/UI/GridForm';
import { MiniHeader } from './BasicTopicsFormView';
import InputSectionView from './InputSectionView';

const AddNewQuestionButton = styled.button`
    cursor: pointer;
    grid-column-start: 1;
    grid-column-end: 3;
`;

const QNATopicsForm = () => {
  const { handleSubmit } = useForm();
  const onSubmit = (data: any) => { console.log(data); };

  return (
    <GridForm onSubmit={handleSubmit(onSubmit)}>
      <MiniHeader>QUESTIONS AND ANSWERS</MiniHeader>
      <InputSectionView full sub_title="TOPIC ALIAS NAME, USED AS IDENTIFIER" title="TOPIC NAME" />
      <AddNewQuestionButton>Add new question</AddNewQuestionButton>
    </GridForm>
  );
};

export default QNATopicsForm;
