import { NexusGenFieldTypes } from '../../generated/nexus';

interface SliderNodeProps {
  DEFAULT_MARKERS: Partial<NexusGenFieldTypes['SliderNodeMarkerType']>[]
}

export const SliderNode: SliderNodeProps = {
  DEFAULT_MARKERS: [
    {
      id: '-1',
      label: 'Amazing!',
      subLabel: 'This is excellent.',
      range: { id: '', start: 9.5 },
    },
    {
      id: '-2',
      label: 'Good!',
      subLabel: 'This is good.',
      range: { id: '', start: 6, end: 9.5 },
    },
    {
      id: '-3',
      label: 'Neutral!',
      subLabel: 'Something is not great.',
      range: { id: '', start: 5, end: 6 },
    },
    {
      id: '-4',
      label: 'Bad',
      subLabel: 'This is bad.',
      range: { id: '', start: 3, end: 5 },
    },
    {
      id: '-5',
      label: 'Terrible',
      subLabel: 'This is terrible',
      range: { id: '', end: 3 },
    },
  ],
};
