import { FolderMinus, FolderPlus, Minus, Plus } from 'react-feather';
import React from 'react';

import { Button } from '@chakra-ui/core';
import { Span } from '@haas/ui';

import { AddChildContainer, AddChildIconContainer } from './QuestionEntryStyles';

interface AddChildComponentProps {
  amtChildren?: number;
  isExpanded: Boolean;
  onExpandChange: () => void;
}

const ShowChildQuestionComponent = ({ amtChildren, isExpanded, onExpandChange }: AddChildComponentProps) => (
  <AddChildContainer>
    <Button leftIcon={isExpanded ? FolderMinus : FolderPlus} onClick={() => onExpandChange()}>
      <Span padding="4px">
        {isExpanded ? `Fold branch (${amtChildren})` : `Expand branch (${amtChildren})`}
      </Span>
    </Button>
  </AddChildContainer>
);

export default ShowChildQuestionComponent;
