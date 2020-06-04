import { Instance, types } from 'mobx-state-tree';

const CustomerColorSettingsModel = types
  .model('CustomerColorSettingsModel', {
    primary: types.maybe(types.string),
    primaryAlt: types.maybe(types.string),
    secondary: types.maybe(types.string),
    secondaryAlt: types.maybe(types.string),
  });

export interface CustomerColorSettingsModelProps extends Instance<typeof CustomerColorSettingsModel>{}

export default CustomerColorSettingsModel;
