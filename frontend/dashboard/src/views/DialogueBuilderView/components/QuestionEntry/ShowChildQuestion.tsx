import { FolderMinus, FolderPlus } from 'react-feather';
import React from 'react';

import { Button } from '@chakra-ui/core';
import { Div, Span } from '@haas/ui';

import { AddChildContainer } from './QuestionEntryStyles';

interface AddChildComponentProps {
  amtChildren?: number;
  isExpanded: Boolean;
  isDisabled: Boolean;
  onExpandChange: () => void;
}

const ShowChildQuestionComponent = ({
  amtChildren,
  isExpanded,
  isDisabled,
  onExpandChange,
}: AddChildComponentProps) => (
  <AddChildContainer isDisabled={isDisabled}>
    <Div>
      <Button leftIcon={isExpanded ? FolderMinus : FolderPlus} onClick={() => onExpandChange()}>
        <Span padding="4px">
          {isExpanded ? `Fold branch (${amtChildren})` : `Expand branch (${amtChildren})`}
        </Span>
      </Button>
    </Div>
  </AddChildContainer>
);

export default ShowChildQuestionComponent;
