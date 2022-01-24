import { Instance, types } from 'mobx-state-tree';

const FormNodeFieldModel = types.model({
  id: types.string,
  label: types.string,
  isRequired: types.boolean,
  type: types.string,
  position: types.number,
  placeholder: types.maybeNull(types.string),
});

const FormNodeModel = types
  .model({
    id: types.string,
    helperText: types.maybeNull(types.string),
    fields: types.array(FormNodeFieldModel),
  });

export interface FormNodeModelProps extends Instance<typeof FormNodeModel> { }

export default FormNodeModel;