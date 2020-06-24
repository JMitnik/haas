import { Instance, applySnapshot, getSnapshot, types } from 'mobx-state-tree';

import { Dialogue } from 'types/generic';
import { createDefaultPostLeafNode } from './Tree/TreeNodeModel';
import CustomerModel, { CustomerModelProps } from './Customer/CustomerModel';
import SessionModel from './Session/SessionModel';
import TreeModel from './Tree/TreeModel';

const TreeStoreModel = types
  .model('TreeStore', {
    session: types.optional(SessionModel, {}),
    tree: types.maybeNull(TreeModel),
    customer: types.maybeNull(CustomerModel),
  })
  .actions((self) => {
    let initialState = {};

    return {
      /**
       * Post-creation, store what the 'default' state looks like
       */
      afterCreate: () => {
        initialState = getSnapshot(self);
      },

      /**
       * Create customer based on customer properties.
       */
      initCustomer: (customer: CustomerModelProps) => {
        const newCustomer = CustomerModel.create({
          id: customer.id,
          name: customer.name,
          settings: customer.settings,
          slug: customer.slug,
        });

        self.customer = newCustomer;
      },

      /**
       * Initiate the tree.
       */
      initTree: (dialogue: Dialogue) => {
        const defaultPostLeafNode = createDefaultPostLeafNode();

        self.tree = TreeModel.create({
          id: dialogue.id,
          title: dialogue.title,
          publicTitle: dialogue.publicTitle,
          activeLeaf: defaultPostLeafNode.id,
        });

        self.tree.setInitialNodes(dialogue.questions);
        self.tree.setInitialEdges(dialogue.edges);
        self.tree.setInitialLeaves(dialogue.leafs);
      },

      /**
       * Reset the entire store based on the initialState's snapshot.
       */
      resetProject: () => {
        applySnapshot(self, initialState);
      },
    };
  })
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
      const resultWithDepth = result.map((result, index) => ({ ...result, depth: index }));
      return resultWithDepth;
    },
  }));

export interface TreeStoreModelProps extends Instance<typeof TreeStoreModel>{}

export default TreeStoreModel;
