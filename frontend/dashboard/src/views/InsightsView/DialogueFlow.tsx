import * as UI from '@haas/ui';
import React from 'react'
import ReactFlow, {
  Controls,
  isNode,
  MiniMap,
  Background
} from "react-flow-renderer";

const DialogueFlow = () => {
  const HEIGHT = '80vh';

  return (
    <UI.Div style={{ borderLeft: '1px solid #e2e8f0' }}>
      <UI.Div style={{ height: HEIGHT, width: '100%' }}>
        <ReactFlow elements={[]}>
          <MiniMap />
          <Controls />
          <Background color="#aaa" gap={12} />
        </ReactFlow>
      </UI.Div>
    </UI.Div>
  )
}

export default DialogueFlow;
