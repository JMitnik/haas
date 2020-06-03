import { Instance, types } from 'mobx-state-tree';

import SessionModel from './Session/SessionModel';
import TreeModel from './Tree/TreeModel';

const TreeStoreModel = types
  .model('TreeStore', {
    session: types.optional(SessionModel, {}),
    tree: TreeModel,
  })
  .views((self) => ({
    /**
     * Extract all visited nodes that lead from the root to the top.
     */
    get relevantSessionEntries() {
      const lastNonLeafNode = self.session.lastNonLeaf;
      const leafNodes = self.session.leafs;
      const { edges } = self.tree;

      const result = [];

      let isStopped = false;

      leafNodes.forEach((node) => {
        result.push({
          edge: null,
          node,
        });
      });

      // While root has not been reached.
      let nextNode;
      while (!isStopped) {
        const activeNode = nextNode || lastNonLeafNode;

        if (!activeNode) {
          break;
        }

        const parentEdge = edges.find((edge) => edge.childNode.id === activeNode?.node?.id);
        result.push({
          edge: parentEdge,
          node: activeNode,
        });

        const nextNodeEntry = self.session?.items.get(parentEdge?.parentNode?.id);

        if (nextNodeEntry) {
          nextNode = nextNodeEntry;
        } else {
          isStopped = true;
        }
      }

      result.reverse();
      const resultWithDepth = result.map((result, index) => ({ ...result, depth: index + 1 }));
      return resultWithDepth;
    },
  }));

export interface TreeStoreModelProps extends Instance<typeof TreeStoreModel>{}

export default TreeStoreModel;
