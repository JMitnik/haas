import { Instance, types } from 'mobx-state-tree';

import { Dialogue } from 'types/generic';
import { defaultPostLeafNode } from './DialogueTree/TreeNodeModel';
import CustomerModel from './Customer/CustomerModel';
import SessionModel from './Session/SessionModel';
import TreeModel from './DialogueTree/TreeModel';

const TreeStoreModel = types
  .model('TreeStore', {
    session: types.optional(SessionModel, {}),
    tree: types.maybeNull(TreeModel),
    customer: types.maybeNull(CustomerModel),
  })
  .actions((self) => ({
    initTree(dialogue: Dialogue) {
      const tree = TreeModel.create({
        title: dialogue.title,
        publicTitle: dialogue.publicTitle,
        activeLeaf: defaultPostLeafNode.id,
      });

      tree.setInitialNodes(dialogue.questions);
      tree.setInitialEdges(dialogue.edges);
      tree.setInitialLeaves(dialogue.leafs);

      self.tree = tree;
    },
  }))
  .views((self) => ({
    /**
     * Extract all visited nodes that lead from the root to the top.
     */
    get relevantSessionEntries() {
      if (!self.tree) {
        throw new Error('Uninitialized tree!');
      }

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
