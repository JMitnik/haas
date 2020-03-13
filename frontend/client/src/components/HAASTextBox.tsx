import React from 'react';
import { useMutation } from '@apollo/react-hooks';

import { Textbox, Button } from '@haas/ui';
import { useHistory } from 'react-router-dom';
import { useHAASTree } from '../hooks/use-haas-tree';
import styled, { css } from 'styled-components';
import { useFormContext } from 'react-hook-form';
import uploadEntryMutation from '../mutations/UploadEntryMutation';


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


export const HAASTextBox = ({ isLeaf }: { isLeaf?: boolean | null }) => {
  const { goToChild, nodeHistoryStack, edgeHistoryStack, formEntryStack } = useHAASTree();
  const history = useHistory();

  const form = useFormContext();
  const [submitForm, { error, loading }] = useMutation(uploadEntryMutation,{
    onCompleted: () => {
      history.push('finished');
    }
  });

  console.log('nodeHistoryStack', nodeHistoryStack);

  const sessionId = sessionStorage.getItem('sessionId') || '';

  const onSubmit = () => {
    submitForm({
      variables: {
        uploadEntriesInput: {
          entries: formEntryStack,
          sessionId
        }
      }
    })
  };

  return (
    <>
      <TextboxContainer>
        {isLeaf ? (
          <Button brand="secondary" onClick={() => onSubmit()}>Submit</Button>
        ) : (
          <Button brand="secondary" onClick={() => goToChild('')}>Submit</Button>
        )}
        <Textbox placeholder="Write your experience here" />
      </TextboxContainer>
    </>
  );
}
