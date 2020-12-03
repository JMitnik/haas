import { Instance, types } from 'mobx-state-tree';

const SliderNodeRangeModel = types.model({
  start: types.maybe(types.number),
  end: types.maybe(types.number),
});

const SliderNodeMarkersModel = types
  .model({
    label: types.string,
    subLabel: types.string,
    range: SliderNodeRangeModel,
  });

export interface SliderNodeMarkersProps extends Instance<typeof SliderNodeMarkersModel>{}

export default SliderNodeMarkersModel;
