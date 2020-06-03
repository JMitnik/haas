import { useAnimation } from 'framer-motion';
import { useForm } from 'react-hook-form';
import React from 'react';

import { Div, H2 } from '@haas/ui';
import { HAASFormEntry } from 'types/generic';
import { cleanInt } from 'utils/cleanInt';
import useDialogueTree from 'providers/DialogueTreeProvider';
import useEdgeTransition from 'hooks/use-edge-transition';
import useProject from 'providers/ProjectProvider';

import { GenericNodeProps } from '../NodeLayout/NodeLayout';
import { SliderNodeContainer, SliderNodeValue } from './SliderNodeStyles';
import Slider from './Slider';

type SliderNodeProps = GenericNodeProps;

const sliderValueAnimeVariants = {
  initial: {
    transform: 'scale(1)',
  },
  active: {
    transform: 'scale(1.5)',
  },
};

const SliderNode = ({ node }: SliderNodeProps) => {
  const store = useDialogueTree();
  const { goToEdge } = useEdgeTransition();
  const controls = useAnimation();
  const { customer, dialogue } = useProject();

  const { watch, getValues, triggerValidation, register } = useForm<HAASFormEntry>({
    defaultValues: {
      numberValue: 50.01,
    },
  });

  const formatSliderEntry = (entry: HAASFormEntry) => {
    const { numberValue, ...entryVals } = entry;

    if (numberValue) {
      return { ...entryVals, numberValue: cleanInt(numberValue) };
    }

    return entry;
  };

  const onSubmit = async () => {
    const validForm = await triggerValidation('numberValue');

    if (validForm) {
      const formEntry = formatSliderEntry(getValues({ nest: true }));

      if (formEntry?.numberValue) {
        store.session.add(node.id, {
          numberValue: formEntry.numberValue,
          textValue: null,
          multiValues: null,
        });

        const nextEdgeId = node.getNextEdgeIdFromKey(formEntry.numberValue);

        if (!customer || !dialogue) {
          throw new Error('We lost customer and/or dialogue');
        }

        goToEdge(customer.slug, dialogue?.id, nextEdgeId);
      }
    }
  };

  const showValue = () => {
    const val = watch({ nest: true }).numberValue;

    if (val) return Number(val / 10).toFixed(1);

    return 0;
  };

  return (
    <SliderNodeContainer>
      <Div>
        <H2>{node.title}</H2>
      </Div>
      <Div>
        <SliderNodeValue initial="initial" variants={sliderValueAnimeVariants} animate={controls}>
          {showValue()}
        </SliderNodeValue>
        <Slider onSubmit={onSubmit} register={register} animationControls={controls} />
      </Div>
    </SliderNodeContainer>
  );
};

export default SliderNode;
