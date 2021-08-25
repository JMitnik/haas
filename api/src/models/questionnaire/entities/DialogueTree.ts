import { NodeType } from '@prisma/client';
import { NexusGenFieldTypes } from '../../../generated/nexus';
import { traverseTree } from '../../../utils/traverseTree';
import { DialogueTreePath } from './DialoguePath';
import { PrismaQuestionNode, DialogueTreeNode, DialogueTreeEdge, DialogueBranchSplit, PrismaEdge } from './DialogueTreeTypes';

/**
 * DialogueTree.
 */
export class DialogueTree {
  nodes: Record<string, DialogueTreeNode>;
  edges: Record<string, DialogueTreeEdge>;
  rootNode?: DialogueTreeNode;

  constructor() {
    this.nodes = {};
    this.edges = {};
  }

  /**
   * Create DialogueTree from Prisma-fetched nodes.
   */
  initFromPrismaNodes = (nodes: PrismaQuestionNode[], edges: PrismaEdge[]) => {
    const rootNode = nodes.find(node => node.isRoot);

    if (!rootNode) {
      throw new Error('Root node not found in nodes');
    }

    const recursiveGetChildren = (
      currentNode: PrismaQuestionNode,
      layer: number,
    ): DialogueTreeNode => {
      const node  = {
        ...currentNode,
        layer,
        isParentNodeOf: [],
      };

      this.nodes[currentNode.id] = node;
      this.nodes[currentNode.id].isParentNodeOf = currentNode?.isParentNodeOf ? (
        currentNode?.isParentNodeOf.map(childEdge => {
          const childNode = nodes.find(node => node.id === childEdge.childNodeId) as DialogueTreeNode;
          const edge = edges.find(edge => childEdge.id === edge.id) as DialogueTreeEdge;

          return {
            ...childEdge,
            childNode: recursiveGetChildren(childNode, layer + 1),
            parentNodeId: currentNode.id,
            conditions: edge.conditions,
          }
        })
      ): [];

      return node;
    };

    const dialogueTreeRootNode = recursiveGetChildren(rootNode, 0);
    this.rootNode = dialogueTreeRootNode;

    return this;
  }

  /**
   * Traverse tree using a callback which takes a path when given edges.
   */
  traverse = (
    decisionCallback: (dialogueTreeNode: DialogueTreeNode) => DialogueTreeEdge | undefined
  ): DialogueTreePath => {
    if (!this.rootNode) {
      throw new Error('Tree has not been initialized');
    }

    return traverseTree(this.rootNode, decisionCallback);
  }

  /**
   * Splits the dialogue by the branches stemming from the root-slider.
   *
   * Example:
   * - Positive => All nodes in Positive (70+).
   * - Neutral => ALl nodes in Neutral (50-70).
   * - Negative => All nodes in Negative (50-).
   */
  getBranchesByRootSlider = (): DialogueBranchSplit => {
    if (!this.rootNode) {
      throw new Error('Tree has not been initialized');
    }

    if (this.rootNode?.type !== NodeType.SLIDER) {
      throw new Error('Root node type is not SLIDER');
    }

    const branches = this.rootNode.isParentNodeOf.reduce<DialogueBranchSplit>((result, current) => {
      const conditionWithRenderValues = current.conditions.find((condition) => condition.renderMax || condition.renderMin);

      if (conditionWithRenderValues?.renderMax
        && result?.negativeBranch?.upperLimit
        && conditionWithRenderValues?.renderMax <= result?.negativeBranch?.upperLimit) {
        result.negativeBranch = {
          rootEdge: current,
          upperLimit: conditionWithRenderValues?.renderMax as number,
        }
      }

      if (conditionWithRenderValues?.renderMin
        && result.positiveBranch?.lowerLimit
        && conditionWithRenderValues?.renderMin >= result.positiveBranch?.lowerLimit) {
        result.positiveBranch = {
          rootEdge: current,
          lowerLimit: conditionWithRenderValues?.renderMin as number,
        }
      }

      return result;
    }, { negativeBranch: { upperLimit: Infinity }, positiveBranch: { lowerLimit: -Infinity } });

    return branches;
  }
}
