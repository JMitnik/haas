import { Minus, Plus } from 'react-feather';
import React from 'react';

import { Span } from '@haas/ui';

import { AddChildContainer, AddChildIconContainer } from './QuestionEntryStyles';

interface AddChildComponentProps {
  amtChildren?: number;
  isExpanded: Boolean;
  onExpandChange: () => void;
}

const ShowChildQuestionComponent = ({ amtChildren, isExpanded, onExpandChange }: AddChildComponentProps) => (
  <AddChildContainer onClick={() => onExpandChange()}>
    <AddChildIconContainer>
      {isExpanded ? <Minus /> : <Plus />}
    </AddChildIconContainer>
    <Span padding="4px">
      {isExpanded ? `Hide children (${amtChildren})` : `Show children (${amtChildren})`}
    </Span>
  </AddChildContainer>
);

export default ShowChildQuestionComponent;
