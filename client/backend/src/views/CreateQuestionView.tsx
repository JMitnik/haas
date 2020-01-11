import React, { useState } from 'react';

import styled, { css } from 'styled-components';
import { ArrowRight, ArrowDown } from 'react-feather';


export const CreateQuestionContainer = styled.div`
    display: grid;
    grid-template-columns: 50% 50%;
    grid-column-start: 1;
    grid-column-end: 3;  
    border: 1px solid black;
    align-self: center;
  `
;

const CentreArrowRight = styled(ArrowRight)`
    /* display:block; */
    align-self: center;

    /* grid-row-start: 1;
    grid-row-end: 2; */
    
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
        &:hover {
            cursor: pointer;
            background: ${theme.defaultColors.normal}
        }    
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
return (
<CreateQuestionContainer>
    <QuestionHeader onClick={e => handleHeaderClick(e)}>
        <QuestionTitle>{props.question_title}</QuestionTitle>
 {isCollapsed ? <CentreArrowRight/> : <CentreArrowDown/>}
    </QuestionHeader>

    {!isCollapsed && <div>Expanded</div>}
</CreateQuestionContainer>)
}

export default CreateQuestionView;