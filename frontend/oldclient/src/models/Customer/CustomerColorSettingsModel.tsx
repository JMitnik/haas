import { Instance, types } from 'mobx-state-tree';

const CustomerColorSettingsModel = types
  .model('CustomerColorSettingsModel', {
    primary: types.maybeNull(types.string),
    primaryAlt: types.maybeNull(types.string),
    secondary: types.maybeNull(types.string),
    secondaryAlt: types.maybeNull(types.string),
  });

export interface CustomerColorSettingsModelProps extends Instance<typeof CustomerColorSettingsModel>{}

export default CustomerColorSettingsModel;
