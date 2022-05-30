import * as UI from '@haas/ui';
import { AlertTriangle } from 'react-feather';
import { Tooltip } from '@chakra-ui/core';
import { useTranslation } from 'react-i18next';
import React from 'react';

import { EdgeConditionProps } from 'views/DialogueBuilderView/DialogueBuilderInterfaces';
import { QuestionNodeProblem } from 'views/DialogueBuilderView/DialogueBuilderTypes';
import HaasNodeIcon from 'components/Icons/HaasNodeIcon';

import * as LS from './QuestionEntryStyles';

interface ConditionLabelProps {
  condition: EdgeConditionProps | undefined;
  id: string;
  activeCTA: string | null;
  problems: (QuestionNodeProblem | undefined)[];
}

const ConditionLabel = ({ activeCTA, id, condition, problems }: ConditionLabelProps) => {
  const { t } = useTranslation();

  // Temporarily focus on one problem.
  const problem = problems[0];

  return (
    <LS.ConditionContainer activeCTA={activeCTA} id={id}>
      <HaasNodeIcon width="25" height="25" isDark />

      {condition?.conditionType === 'match' && (
        <LS.ConditionSpan fontSize="0.6em">
          <abbr title={condition.matchValue || undefined}>{condition.matchValue}</abbr>
        </LS.ConditionSpan>
      )}

      {problem && (
        <LS.QuestionNodeProblem>
          <Tooltip
            label={t('question_problem_range', {
              problemRange: `${problem?.problemWithCondition?.renderMin} - ${problem?.problemWithCondition?.renderMax}`,
              problemIndex: problem.problemWith + 1,
              problemType: problem.problemType,
            })}
            aria-label="Problem!"
          >
            <UI.Icon>
              <AlertTriangle />
            </UI.Icon>
          </Tooltip>
        </LS.QuestionNodeProblem>
      )}

      {condition?.conditionType === 'valueBoundary' && (
        <LS.ConditionSpan fontSize="0.6em">
          {`${condition.renderMin} - ${condition.renderMax}`}
        </LS.ConditionSpan>
      )}
    </LS.ConditionContainer>
  );
};

export default ConditionLabel;

