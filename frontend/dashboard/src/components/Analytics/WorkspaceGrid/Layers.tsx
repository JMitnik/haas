import * as UI from '@haas/ui';
import React from 'react';
import styled, { css } from 'styled-components';

import { ReactComponent as SVGLayer } from 'assets/icons/layer.svg';

import { HexagonState } from './WorkspaceGrid.types';
import { getHexagonSVGFill } from './WorkspaceGrid.helpers';

const LayerContainer = styled.button`
  display: flex;
  align-items: center;
  opacity: 0.5;
  & + & {
    margin-top: -10px;
  }
`;

interface LayerProps {
  state: HexagonState;
  onClick: () => void;
}

const Layer = ({ state, onClick }: LayerProps) => (
  <LayerContainer onClick={onClick}>
    <UI.Div mr={2}>
      <SVGLayer fill={getHexagonSVGFill(state.selectedNode?.score)} />
    </UI.Div>

    <UI.Div>
      <UI.Text color="off.600" fontSize="sm" fontWeight="bold">
        {state.selectedNode?.id}
      </UI.Text>
    </UI.Div>
  </LayerContainer>
);

interface LayersProps {
  historyQueue: HexagonState[];
  onClick: (index: number) => void;
}

const LayersContainer = styled(UI.Div)``;

export const Layers = ({ historyQueue, onClick }: LayersProps) => (
  <LayersContainer>
    {historyQueue.map((state, index) => (
      <Layer onClick={() => onClick(index)} state={state} key={index} />
    ))}
  </LayersContainer>
);
