import React from 'react'
import ReactFlow, {
  Controls,
  isNode,
  MiniMap,
  useZoomPanHelper,
  Background,
  ReactFlowProvider,
  useStore,
} from "react-flow-renderer";
import * as UI from '@haas/ui';
import dagre from 'dagre';

import { DeepPartial } from 'types/customTypes';
import { Edge, QuestionNode } from 'types/generated-types';

import { ReactFlowContainer } from './DialogueFlowStyles';
import { useState } from 'react';

interface DialogueFlowProps {
  nodes: DeepPartial<QuestionNode>[];
  edges: DeepPartial<Edge>[];
}

const DialogueFlow = ({ nodes, edges }: DialogueFlowProps) => {
  const HEIGHT = '85vh';
  const [activeEdges, setActiveEdges] = useState<string[]>([]);
  const { setCenter } = useZoomPanHelper();
  const flowStore = useStore();

  const processedNodes = nodes.map(node => ({
    id: node.id,
    data: { label: node.title }
  }));

  const isInFocusMode = activeEdges.length > 0;

  const focusOnRandomEdge = () => {
    setActiveEdges(["ckgmgt9vo7513188godeqsj2cny", "ckgmjwe3m7588738godpr4aos25", "ckgw41bl616533828godce5wvzsv"]);
    const { edges, nodes } = flowStore.getState();
    const firstEdge = edges.find(edge => edge.id === "ckgmgt9vo7513188godeqsj2cny");
    const parentNodeId = firstEdge?.source;
    const parentNode = nodes.find(node => node.id === parentNodeId);
    const xZoom = parentNode?.__rf?.position.x + (parentNode?.__rf?.width / 2);
    const yZoom = parentNode?.__rf?.position.y + (parentNode?.__rf?.height / 2);
    const zoomLevel = 0.7;

    setCenter(xZoom, yZoom, zoomLevel);
  }

  const processedEdges = edges.map(edge => ({
    id: edge.id,
    source: edge.parentNode?.id,
    target: edge.childNode?.id,
    label: edge.conditions?.[0]?.matchValue || '',
    type: "HAAS_NODE",
    animated: activeEdges.includes(edge.id || '')
  }));

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
      <UI.Button onClick={() => focusOnRandomEdge()}>
        Debug random edge
      </UI.Button>
      <UI.Div>
        <ReactFlowContainer isInFocusMode={isInFocusMode} style={{ height: HEIGHT, width: '100%' }}>
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
