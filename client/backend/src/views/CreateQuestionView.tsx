import React, { useState } from 'react';

import styled, { css } from 'styled-components';
import { ArrowDown, ArrowUp, Square } from 'react-feather';

import CreateQuestionForm from './CreateQuestionFormView'

export const CreateQuestionContainer = styled.div`
    display: grid;
    grid-template-columns: 50% 50%;
    grid-column-start: 1;
    grid-column-end: 3;  
    border: 1px solid black;
    align-self: center;
  `
    ;

const CentreSquare = styled(Square)`
    /* display:block; */
    align-self: center;

    /* grid-row-start: 1;
    grid-row-end: 2; */
    
`

const CentreArrowUp = styled(ArrowUp)`
    align-self: center;
`

const CentreArrowDown = styled(ArrowDown)`
    /* display:block; */
    align-self: center;

    /* grid-row-start: 1;
    grid-row-end: 2; */
    
`

const QuestionHeader = styled.div`
    ${({ theme }) => css`
    display: flex;
    justify-content: space-between;
    grid-column-start: 1;
    grid-column-end: 3;    
    background: ${theme.defaultColors.normal}
    `}
`

const QuestionTitle = styled.h4`
    padding: 10px;
`

const CreateQuestionView = (props: any) => {
    const [isCollapsed, setCollapsed] = useState(true);
    function handleHeaderClick(e: any) {
        e.preventDefault();
        setCollapsed(!isCollapsed);
        console.log('Collapsed: ', isCollapsed);

    }

    function handleMoveDown(e: any) {
        e.preventDefault();
        console.log('HANDLE MOVE DONW')
        props.sendOrderOfQuestionsToParent(props.question_index, 'down')
    }

    function handleMoveUp(e: any) {
        e.preventDefault();
        console.log('HANDLE MOVE UP')
        props.sendOrderOfQuestionsToParent(props.question_index, 'up')
    }

    return (
        <CreateQuestionContainer>
            <QuestionHeader >
                <QuestionTitle>{props.question_title}</QuestionTitle>
                <CentreArrowDown onClick={e => handleMoveDown(e)} />
                <CentreArrowUp onClick={e => handleMoveUp(e)}/>
                <CentreSquare onClick={e => handleHeaderClick(e)} />
            </QuestionHeader>

            {!isCollapsed && <CreateQuestionForm/>}
        </CreateQuestionContainer>)
}

export default CreateQuestionView;