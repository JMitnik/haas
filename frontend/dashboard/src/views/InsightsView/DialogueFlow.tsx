import React from 'react'
import ReactFlow, {
  Controls,
  isNode,
  MiniMap,
  Background
} from "react-flow-renderer";
import * as UI from '@haas/ui';
import dagre from 'dagre';

import { DeepPartial } from 'types/customTypes';
import { Edge, QuestionNode } from 'types/generated-types';

import { ReactFlowContainer } from './DialogueFlowStyles';

interface DialogueFlowProps {
  nodes: DeepPartial<QuestionNode>[];
  edges: DeepPartial<Edge>[];
}

const DialogueFlow = ({ nodes, edges }: DialogueFlowProps) => {
  const HEIGHT = '85vh';

  const processedNodes = nodes.map(node => ({
    id: node.id,
    data: { label: node.title }
  }));

  const processedEdges = edges.map(edge => ({
    id: edge.id,
    source: edge.parentNode?.id,
    target: edge.childNode?.id,
    label: edge.conditions?.[0]?.matchValue || '',
    type: "HAAS_NODE"
  }));

  console.log(processedEdges);
  console.log(processedNodes);

  const dagreGraph = new dagre.graphlib.Graph();
  dagreGraph.setDefaultEdgeLabel(() => ({}));

  const getLayoutElements = () => {
    processedNodes.forEach((el) => {
      dagreGraph.setNode(el?.id || '', { width: 150, height: 80 });
    });

    dagreGraph.setGraph({ rankdir: "LR", edgesep: 120, nodesep: 150, ranksep: 150 });

    processedEdges.forEach((edge) => {
      dagreGraph.setEdge((edge?.source || ''), edge.target || '');
    });

    dagre.layout(dagreGraph);

    return [...processedNodes, ...processedEdges].map((el) => {
      // @ts-ignore
      if (isNode(el)) {
        const nodeWithPosition = dagreGraph.node(el.id);
        // unfortunately we need this little hack to pass a slighltiy different position
        // in order to notify react flow about the change
        el.position = {
          x: nodeWithPosition.x + Math.random() / 1000,
          y: nodeWithPosition.y
        };
      }
      return el;
    });
  };

  const elements = getLayoutElements() as any || [];

  return (
    <UI.Div style={{ borderLeft: '1px solid #e2e8f0', overflow: 'hidden' }}>
      <UI.Div>
        <ReactFlowContainer style={{ height: HEIGHT, width: '100%' }}>
          <ReactFlow elements={elements}>
            <MiniMap nodeColor="#444" className="minimap" />
            <Controls />
            <Background color="#aaa" gap={12} />
          </ReactFlow>
        </ReactFlowContainer>
      </UI.Div>
    </UI.Div>
  )
}

export default DialogueFlow;
