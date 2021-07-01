import { Instance, types } from 'mobx-state-tree';
import SliderNodeMarkersModel from './SliderNodeMarkersModel';

const SliderNodeModel = types
  .model({
    happyText: types.maybeNull(types.string),
    unhappyText: types.maybeNull(types.string),
    markers: types.array(SliderNodeMarkersModel),
  });

export interface SliderNodeModelProps extends Instance<typeof SliderNodeModel>{}

export default SliderNodeModel;
