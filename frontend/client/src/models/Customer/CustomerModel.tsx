import { Instance, types } from 'mobx-state-tree';
import CustomerSettingsModel from './CustomerSettingsModel';

const CustomerModel = types
  .model('CustomerModel', {
    id: types.identifier,
    name: types.string,
    settings: CustomerSettingsModel,
  });

export interface CustomerModelProps extends Instance<typeof CustomerModel>{}

export default CustomerModel;
