import React from 'react';
import { useMutation } from '@apollo/react-hooks';

import { Textbox, Button } from '@haas/ui';
import { useHistory, useLocation } from 'react-router-dom';
import { useHAASTree } from '../hooks/use-haas-tree';
import styled, { css } from 'styled-components';
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
  const { goToChild, entryHistoryStack } = useHAASTree();
  const history = useHistory();
  const location = useLocation();

  const [submitForm] = useMutation(uploadEntryMutation,{
    onCompleted: () => {
      history.push(`${location.pathname}/finished`);
    }
  });

  const onSubmit = () => {
    submitForm({
      variables: {
        uploadUserSessionInput: {
          entries: entryHistoryStack,
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
