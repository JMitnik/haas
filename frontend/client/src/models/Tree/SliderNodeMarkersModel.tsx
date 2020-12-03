import { Instance, types } from 'mobx-state-tree';

const SliderNodeRangeModel = types.model({
  start: types.maybeNull(types.number),
  end: types.maybeNull(types.number),
});

const SliderNodeMarkersModel = types
  .model({
    label: types.string,
    subLabel: types.string,
    range: SliderNodeRangeModel,
  });

export interface SliderNodeMarkersProps extends Instance<typeof SliderNodeMarkersModel>{}

export default SliderNodeMarkersModel;
