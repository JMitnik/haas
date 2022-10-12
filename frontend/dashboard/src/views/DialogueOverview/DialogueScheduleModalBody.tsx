import * as UI from '@haas/ui';
import React, { useState } from 'react';

import { DataPeriodSchedule, EvaluationPeriodSchedule } from 'types/generated-types';
import { ReactComponent as TopicsThumbnail } from 'assets/images/thumbnails/sm/rounded-topics.svg';

enum DialogueScheduleStep {
  INTRO = 'intro',
  DATA_PERIOD = 'dataPeriod',
  EVAL_PERIOD = 'evalPeriod',
}

interface DialogueScheduleState {
  [DialogueScheduleStep.DATA_PERIOD]?: DataPeriodSchedule,
  [DialogueScheduleStep.EVAL_PERIOD]?: EvaluationPeriodSchedule,
}

const steps = [
  DialogueScheduleStep.INTRO, DialogueScheduleStep.DATA_PERIOD, DialogueScheduleStep.EVAL_PERIOD
];

const defaultState: DialogueScheduleState = {
  dataPeriod: undefined,
  evalPeriod: undefined,
};

const IntroStep = () => (
  <div>
    test
  </div>
);

const DataPeriodStep = () => (
  <div>
    test2
  </div>
);

const EvalPeriodStep = () => (
  <div>
    test3
  </div>
);

export const DialogueScheduleModalBody = () => {
  const [activeStepIndex, setActiveStepIndex] = useState(0);
  const activeStep = steps[activeStepIndex];
  const [state, setState] = useState<DialogueScheduleState>(defaultState);

  return (
    <UI.Div>
      <UI.ModalHead>
        <UI.Flex>
          <UI.Div maxWidth={70} mr={2}>
            <UI.Thumbnail size="sm">
              <TopicsThumbnail />
            </UI.Thumbnail>
          </UI.Div>

          <UI.Div>
            <UI.H3 color="off.500">
              Schedule
            </UI.H3>
            <UI.Text fontSize="1.1rem" color="off.400">
              Setup your dialogue schedule here
            </UI.Text>
          </UI.Div>
        </UI.Flex>
      </UI.ModalHead>

      <UI.ModalBody>
        {activeStep === DialogueScheduleStep.INTRO && (
          <IntroStep />
        )}
        {activeStep === DialogueScheduleStep.DATA_PERIOD && (
          <DataPeriodStep />
        )}
        {activeStep === DialogueScheduleStep.EVAL_PERIOD && (
          <EvalPeriodStep />
        )}
      </UI.ModalBody>

      <UI.Div>
        <UI.Flex>
          <UI.Div>
            <UI.Button
              isDisabled={activeStepIndex === 0}
              onClick={() => setActiveStepIndex((idx) => idx - 1)}
            >
              Prev
            </UI.Button>
            <UI.Button
              isDisabled={activeStepIndex === steps.length - 1}
              onClick={() => setActiveStepIndex((idx) => idx + 1)}
            >
              Next
            </UI.Button>
          </UI.Div>
        </UI.Flex>
      </UI.Div>
    </UI.Div>
  );
};
