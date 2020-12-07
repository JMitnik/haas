import { Instance, types } from 'mobx-state-tree';
import SliderNodeMarkersModel from './SliderNodeMarkersModel';

const SliderNodeModel = types
  .model({
    markers: types.array(SliderNodeMarkersModel),
  });

export interface SliderNodeModelProps extends Instance<typeof SliderNodeModel>{}

export default SliderNodeModel;
