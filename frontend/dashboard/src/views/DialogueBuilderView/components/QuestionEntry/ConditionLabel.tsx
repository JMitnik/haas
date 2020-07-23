import React from 'react';

import { EdgeConditonProps } from 'views/DialogueBuilderView/DialogueBuilderInterfaces';
import HaasNodeIcon from 'components/Icons/HaasNodeIcon';

import { ConditionContainer, ConditionSpan } from './QuestionEntryStyles';

interface ConditionLabelProps {
  condition: EdgeConditonProps | undefined;
  id: string;
  activeCTA: string | null;
}

const ConditionLabel = ({ activeCTA, id, condition } : ConditionLabelProps) => (
  <ConditionContainer activeCTA={activeCTA} id={id}>
    <HaasNodeIcon width="25" height="25" isDark />
    {condition?.conditionType === 'match' && (
    <ConditionSpan fontSize="0.6em">
      <abbr title={condition.matchValue}>{condition.matchValue}</abbr>
    </ConditionSpan>
      )}

    {condition?.conditionType === 'valueBoundary' && (
    <ConditionSpan fontSize="0.6em">
      {`${condition.renderMin} - ${condition.renderMax}`}
    </ConditionSpan>
      )}

  </ConditionContainer>
);

export default ConditionLabel;

