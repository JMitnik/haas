import React from 'react';
import { useForm } from 'react-hook-form';
import styled, { css } from 'styled-components/macro';

interface InputSectionContainerProps {
  full: boolean;
}

const InputSectionContainer = styled.div<InputSectionContainerProps>`
    ${({ full }) => css`
      display: flex;
      flex-direction: column;
      grid-column-start: ${full ? 1 : 'auto'};
      grid-column-end: ${full ? 3 : 'auto'};
    `}
`;

interface InputSectionProps {
  title: string;
  sub_title: string;
  full: boolean;
}

const NameInputForm = ({ title, sub_title, full }: InputSectionProps) => {
  const { register } = useForm();

  return (
    <InputSectionContainer full={full}>
      <h5>{title}</h5>
      <h6>{sub_title}</h6>
      <input name="exampleRequired" ref={register({ required: true })} />
    </InputSectionContainer>
  );
};

export default NameInputForm;
