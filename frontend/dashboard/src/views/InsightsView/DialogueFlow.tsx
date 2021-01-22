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
import { Edge, QuestionNode, QuestionNodeTypeEnum } from 'types/generated-types';

import { ReactFlowContainer } from './DialogueFlowStyles';
import { useState } from 'react';
import { useEffect } from 'react';
import { DialoguePathHandle, DialoguePathType } from './InsightsView';

interface DialogueFlowProps {
  nodes: DeepPartial<QuestionNode>[];
  edges: DeepPartial<Edge>[];
  pinnedPath?: DialoguePathType | null;
  hoverPath?: DialoguePathType | null;
}

const DialogueFlow = ({ nodes, edges, pinnedPath, hoverPath }: DialogueFlowProps) => {
  const HEIGHT = '85vh';
  const { setCenter } = useZoomPanHelper();
  const flowStore = useStore();

  const activeEdges = pinnedPath?.edges;

  const processedNodes = nodes.map(node => ({
    id: node.id,
    data: { label: node.title }
  }));

  const isInFocusMode = (pinnedPath?.edges || []).length > 0;

  const focusOnRandomEdge = () => {
    const { edges, nodes } = flowStore.getState();
    const firstEdge = edges.find(edge => edge.id === "ckgmgt9vo7513188godeqsj2cny");
    const parentNodeId = firstEdge?.source;
    const parentNode = nodes.find(node => node.id === parentNodeId);
    const xZoom = parentNode?.__rf?.position.x + (parentNode?.__rf?.width / 2);
    const yZoom = parentNode?.__rf?.position.y + (parentNode?.__rf?.height / 2);
    const zoomLevel = 0.7;

    setCenter(xZoom, yZoom, zoomLevel);
  }

  useEffect(() => {
    if (pinnedPath) {
      focusOnRandomEdge();
    }
  }, [pinnedPath, focusOnRandomEdge]);

  const processedEdges = edges.map(edge => {
    const isActive = activeEdges?.includes(edge?.id || '');
    return {
      id: edge.id,
      source: edge.parentNode?.id,
      target: edge.childNode?.id,
      label: edge.conditions?.[0]?.matchValue || '',
      className: isActive ? (
        pinnedPath?.handle === DialoguePathHandle.POPULAR ? 'popular' : 'critical')
        : ''
      ,
      animated: activeEdges?.includes(edge?.id || '')
    }
  });

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
        <ReactFlowContainer
          isInFocusMode={isInFocusMode}
          style={{ height: HEIGHT, width: '100%' }}
        >
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
