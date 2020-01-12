import React, {useState} from 'react'

import { useForm } from 'react-hook-form'
import { GridForm } from '../components/UI/GridForm'

import { CheckBoxWrapper, CheckBox, CheckBoxLabel } from '../components/UI/Form'
import InputSectionView from './InputSectionView'
import OpenQuestionView from './OpenQuestionView'
import styled, {css} from 'styled-components';

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

const FullHr = styled.hr`
    grid-column-start: 1;
    grid-column-end: 3;
`

const QuestionType = styled.div`
    display: flex;
    grid-column-start: 1;
    grid-column-end: 3;

`

interface IQuestionType {
    questionType: string;
    currentQuestionType: string;
}

const QuestionTypeButton = styled.label<IQuestionType>`
    background: ${props => props.questionType == props.currentQuestionType ? 'purple' : 'white'};

    ${({ theme }) => css`
        cursor: pointer;
        padding: 10px;
        /* background: ${theme.defaultColors.alt}; */
        border: 1px solid black;    

    `}      
`
    
const CreateQuestionForm = () => {
    const { handleSubmit, watch } = useForm()
    const [currentQuestionType, setOpenQuestion] = useState('open');
    
    const onSubmit = (data: any) => { console.log(data) }
    console.log(watch('example')) // watch input value by passing the name of it
    function handleQuestionType(e: any, questionType: string) {
        e.preventDefault();
        console.log('Question type: ', questionType)
        setOpenQuestion(questionType)
    }
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
                <FullHr/>
                <QuestionType>
                    <QuestionTypeButton currentQuestionType={currentQuestionType} questionType='open' onClick={e => handleQuestionType(e, 'open')}>OPEN-END ANSWERS</QuestionTypeButton>
                    <QuestionTypeButton currentQuestionType={currentQuestionType} questionType='multiple' onClick={e => handleQuestionType(e, 'multiple')}>MULTIPLE CHOICE</QuestionTypeButton>
                </QuestionType>

                {currentQuestionType == 'open' ? <OpenQuestionView/> : <div>CLOSE</div>}
                
            </GridForm>
        </FullGrid>
    )
};

export default CreateQuestionForm;