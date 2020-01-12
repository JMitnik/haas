import React from 'react';

import styled from 'styled-components';

const OpenQuestionContainer = styled.div`
    grid-column-start: 1;
    grid-column-end: 3;
    border: 1px solid black;
`;

const OpenQuestionForm = () => (
  <OpenQuestionContainer>OPEN QUESTION CONTAINER</OpenQuestionContainer>
);

export default OpenQuestionForm;
