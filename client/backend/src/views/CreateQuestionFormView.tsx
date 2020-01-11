import React from 'react'

import { useForm } from 'react-hook-form'
import { GridForm } from '../components/UI/GridForm'

import { CheckBoxWrapper, CheckBox, CheckBoxLabel } from '../components/UI/Form'
import InputSectionView from './InputSectionView'
import styled from 'styled-components';

export const MiniHeader = styled.h4`
    grid-column-start: 1;
    grid-column-end: 3;
    padding: 10px;
  `
;

const FullGrid = styled.div`
    grid-column-start: 1;
    grid-column-end: 3;
`

const CreateQuestionForm = (props: any) => {
    const { handleSubmit, watch } = useForm()
    const onSubmit = (data: any) => { console.log(data) }
    console.log(watch('example')) // watch input value by passing the name of it

    return (
        <FullGrid>
            <GridForm onSubmit={handleSubmit(onSubmit)}>
                <InputSectionView full={true} sub_title="" title="" />
                {/* register your input into the hook by invoking the "register" function */}
                <CheckBoxWrapper>
                    <CheckBox id="in_range" type="checkbox" />
                    <CheckBoxLabel htmlFor="in_range" />
                    <h5>SHOW IF VOTE IN RANGE</h5>
                </CheckBoxWrapper>

                <CheckBoxWrapper>
                    <CheckBox id="checkbox" type="checkbox" />
                    <CheckBoxLabel htmlFor="checkbox" />
                    <h5>JUMP ONLY</h5>
                </CheckBoxWrapper>
            </GridForm>
        </FullGrid>
    )
};

export default CreateQuestionForm;