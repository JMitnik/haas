import { inputObjectType } from '@nexus/schema';
import { SessionEventType } from './SessionEventType';

export const SessionEventChoiceValueInput = inputObjectType({
  name: 'SessionEventChoiceValueInput',
  description: 'Input type of a SessionEvent for Choices.',

  definition(t) {
    // What is the raw value of the choice?
    t.string('value', { required: true });

    // Require that the related node of the choice is specificed.
    t.string('relatedNodeId', { required: true });

    // Require that the option connected to the choice is specificed.
    t.string('optionId');

    // How much time did the user spend to create this event.
    t.int('timeSpent');
  },
});

export const SessionEventSliderValueInput = inputObjectType({
  name: 'SessionEventSliderValueInput',
  description: 'Input type of a SessionEvent for Sliders.',

  definition(t) {
    // What is the raw value of the choice?
    t.int('value', { required: true });

    // Require that the related node of the choice is specificed.
    t.string('relatedNodeId', { required: true });

    // How much time did the user spend to create this event.
    t.int('timeSpent');
  },
});

export const SessionEventInput = inputObjectType({
  name: 'SessionEventInput',
  description: 'Input type of a SessionEvent',

  definition(t) {
    t.string('sessionId', { required: true });

    t.date('timestamp', { required: true });

    t.field('eventType', { type: SessionEventType, required: true });

    // Identifier for which node the event leads to.
    t.string('toNodeId');

    t.field('choiceValue', { type: SessionEventChoiceValueInput });

    // Field value for slider
    t.field('sliderValue', { type: SessionEventSliderValueInput });
  },
});
