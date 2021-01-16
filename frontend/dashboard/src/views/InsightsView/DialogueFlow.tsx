import React from 'react'
import ReactFlow, {
  Controls,
  isNode,
  MiniMap,
  Background
} from "react-flow-renderer";
import * as UI from '@haas/ui';

import { Edge, QuestionNode } from 'types/generated-types';
import dagre from 'dagre';
import { DeepPartial } from 'types/customTypes';

interface DialogueFlowProps {
  nodes: DeepPartial<QuestionNode>[];
  edges: DeepPartial<Edge>[];
}

const DialogueFlow = ({ nodes, edges }: DialogueFlowProps) => {
  const HEIGHT = '80vh';

  const processedNodes = nodes.map(node => ({
    id: node.id,
    data: { label: node.title }
  }));

  const processedEdges = edges.map(edge => ({
    id: edge.id,
    source: edge.parentNode?.id,
    target: edge.childNode?.id,
    type: "HAAS_NODE"
  }));

  console.log(processedEdges);
  console.log(processedNodes);

  const dagreGraph = new dagre.graphlib.Graph();
  dagreGraph.setDefaultEdgeLabel(() => ({}));

  const getLayoutElements = () => {
    processedNodes.forEach((el) => {
      dagreGraph.setNode(el?.id || '', { width: 150, height: 50 });
    });

    dagreGraph.setGraph({ rankdir: "LR" });

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
    <UI.Div style={{ borderLeft: '1px solid #e2e8f0' }}>
      <UI.Div style={{ height: HEIGHT, width: '100%' }}>
        <ReactFlow elements={elements}>
          <MiniMap />
          <Controls />
          <Background color="#aaa" gap={12} />
        </ReactFlow>
      </UI.Div>
    </UI.Div>
  )
}

export default DialogueFlow;
