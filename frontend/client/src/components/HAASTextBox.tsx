import React from 'react';
import { Textbox, Button } from '@haas/ui';
import { useJSONTree } from '../hooks/use-json-tree';
import styled, { css } from 'styled-components';


const TextboxContainer = styled.div`
  ${({ theme }) => css`
    ${Button} {
      position: absolute;
      right: ${theme.gutter}px;
      top: 50%;
      transform: translateY(-50%);
    }
  `}
`;


export const HAASTextBox = () => {
  const { goToChild } = useJSONTree();

  return (
    <>
      <TextboxContainer>
        <Button brand="secondary" onClick={() => goToChild('mic_test')}>Submit</Button>
        <Textbox placeholder="Write your experience here" />
      </TextboxContainer>
    </>
  );
}
