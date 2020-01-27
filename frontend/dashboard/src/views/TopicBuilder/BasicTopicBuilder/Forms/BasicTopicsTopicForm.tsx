import React from 'react';
import { gql, ApolloError } from 'apollo-boost';
import { useForm } from 'react-hook-form';
import styled from 'styled-components';

import { CheckBoxWrapper, CheckBox, CheckBoxLabel, GridForm, H4 } from '@haas/ui';
import { useMutation } from '@apollo/react-hooks';
import InputSectionView from './NameInputForm';

const AddTopicMutation = gql`
  mutation AddTopic($data: TopicCreateInput!) {
    createTopic(data: $data) {
      title
    }
  }
`;

interface FormData {
  title: String;
  description: String;
  language: String;
}

const BasicTopicsTopicForm = () => {
  const { register, handleSubmit, errors } = useForm<FormData>();
  const [addTopic, {loading, error}] = useMutation(AddTopicMutation, {
    onCompleted: () => {
      console.log('Added a topic!');
    },
    onError: (serverError: ApolloError) => {
      console.log(error);
    },
  });

  const onSubmit = (data: FormData) => {
    // TODO: Make better typescript supported
    addTopic({
      variables: {
        data: {
          title: data.title,
          description: data.description,
          language: data.language,
        },
      },
    });
  };

  const options: Array<string> = ['English', 'Dutch', 'Russian', 'Chinese'];

  return (
    <GridForm onSubmit={handleSubmit(onSubmit)}>
      {/* <MiniHeader py={2}>BASIC TOPIC DETAILS</MiniHeader> */}
      <input name="title" ref={register({ required: true })} />
      <input name="description" ref={register({ required: true })} />
      <input name="language" ref={register({ required: true })} />
      {/* <InputSectionView full={false} sub_title="TOPIC URL PREVIEW" title="TOPIC URL NAME" />
      <InputSectionView full sub_title="HOW DO YOU FEEL ABOUT" title="TOPIC DISPLAY NAME" />
      <InputSectionView full sub_title="" title="TOPIC DESCRIPTION" />
      <InputSectionView
        full
        sub_title="ADD AN EXTERNAL WEBSITE AS ADDITIONAL INFORMATION IF NEEDED"
        title="EXTERNAL DESCRIPTION URL"
      /> */}
      <input type="submit" />
    </GridForm>
  );
};

const DefaultLanguageSection = styled.div`
    grid-column-start: 1;
    grid-column-end: 3;
`;

export const MiniHeader = styled(H4)`
    grid-column-start: 1;
    grid-column-end: 3;
`;

export default BasicTopicsTopicForm;
