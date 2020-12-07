import { Instance, types } from 'mobx-state-tree';
import SliderNodeMarkersModel from './SliderNodeMarkersModel';

const FormNodeFieldModel = types.model({
  id: types.string,
  label: types.string,
  isRequired: types.boolean,
  type: types.string,
  position: types.number,
});

const FormNodeModel = types
  .model({
    id: types.string,
    fields: types.array(FormNodeFieldModel),
  });

export interface FormNodeModelProps extends Instance<typeof FormNodeModel>{}

export default FormNodeModel;
