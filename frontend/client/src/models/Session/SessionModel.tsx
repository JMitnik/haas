import { Instance, types } from 'mobx-state-tree';

import SessionEntryModel, { SessionEntryDataProps } from './SessionEntryModel';

const SessionModel = types
  .model({
    items: types.map(SessionEntryModel),
    isAtLeaf: types.optional(types.boolean, false),
  })
  .actions((self) => ({
    add(nodeId: string, data: SessionEntryDataProps) {
      self.items.set(nodeId, {
        node: nodeId,
        data,
      });
    },
    reset() {
      self.items.clear();
    },
    setIsAtLeaf(isAtLeaf: boolean) {
      self.isAtLeaf = isAtLeaf;
    },
  }))
  .views((self) => ({
    get lastNonLeaf() {
      const reversedItems = Array.from(self.items.toJS().values()).reverse();
      const firstNonLeaf = reversedItems.find((el) => !el.node.isLeaf);

      return firstNonLeaf;
    },
    get leafs() {
      return Array.from(self.items.toJS().values()).filter((item) => item.node.isLeaf);
    },
    get isEmpty() {
      return self.items.size === 0;
    },
  }));

export interface EntryListProps extends Instance<typeof SessionModel>{}

export default SessionModel;
