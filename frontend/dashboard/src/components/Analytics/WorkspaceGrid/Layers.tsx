import * as UI from '@haas/ui';
import { AnimateSharedLayout, motion } from 'framer-motion';
import React from 'react';
import styled, { css } from 'styled-components';

import { ReactComponent as SVGLayer } from 'assets/icons/layer.svg';
import { slideUpFadeMotion } from 'components/animation/config';

import { HexagonState, HexagonViewMode } from './WorkspaceGrid.types';
import { getColorScoreBrand, getHexagonSVGFill } from './WorkspaceGrid.helpers';

interface LayerContainerProps {
  hide?: boolean;
  hideAll?: boolean;
}

const LayerContainer = motion.custom(styled.button<LayerContainerProps>`
  ${({ theme, hide, hideAll }) => css`
    position: relative;
    display: flex;
    align-items: center;
    transition: all ${theme.transitions.normal};

    ${hide && css`
      > ${UI.Flex} {
        opacity: 0.2;
      }

      ${!hideAll && css`
        &:hover {
          > ${UI.Flex} {
            opacity: 1;
            transition: all ${theme.transitions.normal};
          }
        }
      `}
    `}

    ${(!hide || hideAll) && css`
      cursor: auto;
    `}

    svg {
      filter: drop-shadow(1px 5px 11px rgba(43,46,50,.1))
    }

    & + & {
      margin-top: -5px;
    }
  `}
`);

interface LayerProps {
  state: HexagonState;
  zIndex: number;
  hide?: boolean;
  hideAll?: boolean;
  onClick?: () => void;
}

const Layer = ({ state, onClick, hide, hideAll, zIndex }: LayerProps) => (
  <LayerContainer
    layout
    hide={hide}
    hideAll={hideAll}
    onClick={onClick}
    style={{ zIndex: Math.floor(100 * (1 / (zIndex + 1))) }}
    {...slideUpFadeMotion}
  >
    <UI.Flex>
      <UI.Div position="relative" mr={2}>
        {(hide && !hideAll) ? (
          <SVGLayer fill={getHexagonSVGFill(state.selectedNode?.score)} />
        ) : (
          <SVGLayer fill="url('#grays')" />
        )}
      </UI.Div>

      <UI.Div style={{ textAlign: 'left' }}>
        <UI.Flex alignItems="center">
          <UI.Label
            width={100}
            color={getColorScoreBrand(hide ? state.selectedNode?.score : undefined)}
          >
            {!hideAll && (
              <>
                {state?.viewMode}
              </>
            )}
          </UI.Label>
          {!hideAll && (
            <UI.Text
              color={getColorScoreBrand(hide ? state.selectedNode?.score : undefined)}
              textAlign="left"
            >
              {hide ? (
                <>
                  {/* @ts-ignore */}
                  {state?.selectedNode?.label}
                </>
              ) : (
                <>
                  {state?.viewMode !== HexagonViewMode.Final && (
                    <>
                      Select your {' '}
                      {state?.viewMode}
                    </>
                  )}
                </>
              )}
            </UI.Text>
          )}
        </UI.Flex>
      </UI.Div>
    </UI.Flex>
  </LayerContainer>
);

interface LayersProps {
  currentState: HexagonState;
  historyQueue: HexagonState[];
  onClick: (index: number) => void;
}

const LayersContainer = styled(UI.Div)``;

export const Layers = ({ currentState, historyQueue, onClick }: LayersProps) => (
  <AnimateSharedLayout>
    <UI.Div>
      <UI.Div mb={1}>
        <UI.Helper color="off.300" fontSize="0.7rem !important" fontWeight={700}>Layers</UI.Helper>
      </UI.Div>
      <LayersContainer>
        {historyQueue.map((state, index) => (
          <Layer hide zIndex={index} onClick={() => onClick(index)} state={state} key={`${state.viewMode} - ${index}`} />
        ))}

        {currentState && (
          <Layer key={`current: ${currentState.viewMode}`} zIndex={historyQueue.length} state={currentState} />
        )}

        {(currentState?.viewMode !== HexagonViewMode.Final && currentState?.viewMode !== HexagonViewMode.Session) && (
          <Layer
            hideAll
            hide
            key={`future: ${currentState.viewMode}`}
            zIndex={historyQueue.length}
            state={currentState}
          />
        )}
      </LayersContainer>
    </UI.Div>
  </AnimateSharedLayout>
);
