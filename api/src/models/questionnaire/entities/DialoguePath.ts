import { DialogueTreeEdge, DialogueTreeNode } from "./DialogueTreeTypes";
import { maxBy } from 'lodash';

export class DialogueTreePath {
  nodes: DialogueTreeNode[];
  edges: DialogueTreeEdge[];
  callToActionId?: string;

  constructor(nodes: DialogueTreeNode[], edges: DialogueTreeEdge[], callToActionId?: string) {
    this.nodes = nodes;
    this.edges = edges;
    this.callToActionId = callToActionId;
  }

  prepend(node: DialogueTreeNode): void {
    this.nodes = [node, ...this.nodes];
  }

  append(node: DialogueTreeNode): void {
    this.nodes = [...this.nodes, node];
  }

  getLastNode(): DialogueTreeNode {
    return maxBy(this.nodes, (node => node.layer)) as DialogueTreeNode;
  }
}
