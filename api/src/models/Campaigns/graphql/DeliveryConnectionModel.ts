import { objectType } from 'nexus';

import { DeliveryModel } from './DeliveryModel';
import { ConnectionInterface } from '../../general/Pagination';

export const DeliveryConnectionModel = objectType({
  name: 'DeliveryConnectionType',

  definition(t) {
    t.implements(ConnectionInterface);
    t.nonNull.list.nonNull.field('deliveries', { type: DeliveryModel });
  },
});
