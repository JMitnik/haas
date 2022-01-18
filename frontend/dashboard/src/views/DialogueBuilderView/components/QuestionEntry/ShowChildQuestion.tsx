import { Button } from '@chakra-ui/core';
import { Div, Span } from '@haas/ui';
import { FolderMinus, FolderPlus } from 'react-feather';
import { useTranslation } from 'react-i18next';
import React from 'react';

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
}: AddChildComponentProps) => {
  const { t } = useTranslation();
  return (
    <AddChildContainer isDisabled={isDisabled}>
      <Div>
        <Button leftIcon={isExpanded ? FolderMinus : FolderPlus} onClick={() => onExpandChange()}>
          <Span padding="4px">
            {isExpanded ? `${t('dialogue:fold_branch')} (${amtChildren})` : `${t('dialogue:expand_branch')} (${amtChildren})`}
          </Span>
        </Button>
      </Div>
    </AddChildContainer>
  );
};
export default ShowChildQuestionComponent;
