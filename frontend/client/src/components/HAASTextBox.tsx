import React from 'react';
import { H1, H5, Textbox, Slider, Flex, ColumnFlex, Button, Div } from '@haas/ui';
import { useFormContext } from 'react-hook-form';
import { useJSONTree, MultiChoiceOption } from '../hooks/use-json-tree';
import { Instagram } from 'react-feather';
import { useTransition, animated } from 'react-spring';
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
