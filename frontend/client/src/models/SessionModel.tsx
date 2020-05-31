import { Instance, types } from 'mobx-state-tree';

import SessionEntryModel, { SessionEntryDataProps } from './SessionEntryModel';

const SessionModel = types
  .model({
    items: types.map(SessionEntryModel),
  })
  .actions((self) => ({
    add(nodeId: string, data: SessionEntryDataProps) {
      self.items.set(nodeId, { node: nodeId, data });
    },
  }))
  .views((self) => ({
    get lastNonLeaf() {
      const reversedItems = Array.from(self.items.toJS().values()).reverse();
      const firstNonLeaf = reversedItems.find((el) => !el.node.isLeaf);

      return firstNonLeaf;
    },
  }));
export interface EntryListProps extends Instance<typeof SessionModel>{}

export default SessionModel;
