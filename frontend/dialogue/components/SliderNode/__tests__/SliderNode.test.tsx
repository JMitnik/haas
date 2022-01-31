import { render } from '@testing-library/react';

import { QuestionNodeTypeEnum } from 'types/generated-types';
import { QuestionNode } from 'types/core-types';

import { SliderNode } from '../SliderNode';

const sampleSliderNode: QuestionNode = {
  id: 'slider-node-id',
  children: [],
  isLeaf: false,
  isRoot: true,
  links: [],
  title: 'Slider node title',
  type: QuestionNodeTypeEnum.Slider,
  sliderNode: {
    happyText: 'Happy',
    unhappyText: 'Unhappy',
    markers: [{ id: 'marker-id', label: 'Hello', range: { id: 'marker-range', start: 0, end: 30 }, subLabel: 'Hello2' }],
  },
  options: [],
}

test('renders slider-node', async () => {
  render(<SliderNode node={sampleSliderNode} onRunAction={() => {}} />);
})
