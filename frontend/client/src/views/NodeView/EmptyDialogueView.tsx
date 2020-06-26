import { ColumnFlex, Div, H3, Paragraph } from '@haas/ui';
import React from 'react';

const EmptyDialogueView = () => (
  <ColumnFlex width="100%" alignItems="center" justifyContent="center">
    <Div>
      <H3 textAlign="center">
        Hello! It seems no questions are currently available for this dialogue.
      </H3>

      <Paragraph>
        We will be ready for our conversation soon!
      </Paragraph>
    </Div>
  </ColumnFlex>
);

export default EmptyDialogueView;
