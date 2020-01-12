import React from 'react';

import styled, { css } from 'styled-components';

const OpenQuestionContainer = styled.div`
    grid-column-start: 1;
    grid-column-end: 3;
    border: 1px solid black;
`

const OpenQuestionView = () => {
  
    return (
        <OpenQuestionContainer>OPEN QUESTION CONTAINER</OpenQuestionContainer>
    );
  };
  
  export default OpenQuestionView;