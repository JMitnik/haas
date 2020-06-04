import { Instance, types } from 'mobx-state-tree';
import CustomerColorSettingsModel from './CustomerColorSettingsModel';

const CustomerSettingsModel = types
  .model('CustomerSettingsModel', {
    logoUrl: types.string,
    colourSettings: CustomerColorSettingsModel,
  });

export interface CustomerSettingsModelProps extends Instance<typeof CustomerSettingsModel>{}

export default CustomerSettingsModel;
