import * as UI from '@haas/ui';
import { ChevronRight, Filter, Home } from 'react-feather';
import React, { useEffect, useRef } from 'react';

import * as LS from './WorkspaceGrid.styles';
import { HexagonState, HexagonViewMode } from './WorkspaceGrid.types';

interface BreadCrumbProps {
  viewMode: HexagonViewMode;
  maxWidth: number;
  historyQueue: HexagonState[];
  onJumpToIndex: (index: number) => void;
}

export const BreadCrumb = ({ historyQueue, viewMode, onJumpToIndex, maxWidth }: BreadCrumbProps) => {
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (scrollRef.current && containerRef.current) {
      containerRef.current.scrollLeft = scrollRef.current.offsetLeft + 200;
    }
  }, [viewMode]);

  return (
    <LS.ControlContainer
      ref={containerRef}
      width="auto"
      as="span"
      height="48px"
      style={{ whiteSpace: 'pre', maxWidth, overflow: 'scroll', scrollbarWidth: 'none' }}
    >
      <UI.Flex alignItems="center">
        <UI.Span>
          <LS.ControlBody bg="gray.200" color="gray.400" style={{ borderRadius: '10px 0 0 10px' }}>
            <UI.Icon height="2rem" display="flex" style={{ alignItems: 'center' }}>
              <Filter />
            </UI.Icon>
          </LS.ControlBody>
        </UI.Span>
        <LS.ControlBody>
          <UI.Flex alignItems="center">
            <UI.Button
              onClick={() => onJumpToIndex(0)}
              isDisabled={historyQueue.length === 0}
              variantColor="gray"
              variant="ghost"
              size="sm"
            >
              <UI.Icon>
                <Home />
              </UI.Icon>
            </UI.Button>

            {historyQueue.map((state, index) => (
              <React.Fragment key={state.selectedNode?.id}>
                <UI.Icon>
                  <ChevronRight />
                </UI.Icon>

                <UI.Button onClick={() => onJumpToIndex(index + 1)} variantColor="gray" variant="ghost" size="sm">
                  {state.selectedNode?.label}
                </UI.Button>
              </React.Fragment>
            ))}

            {viewMode === HexagonViewMode.Workspace && (
              <>
                <UI.Icon color="gray.500">
                  <ChevronRight />
                </UI.Icon>

                {/* TODO: Not correct, needs to be dependent on visible children */}
                <UI.Span ref={scrollRef} color="gray.500" mx={2} pr={2}>
                  Select a group
                </UI.Span>
              </>
            )}

            {viewMode === HexagonViewMode.Dialogue && (
              <>
                <UI.Icon color="gray.500">
                  <ChevronRight />
                </UI.Icon>

                <UI.Span ref={scrollRef} color="gray.500" mx={2} pr={2}>
                  Select a team
                </UI.Span>
              </>
            )}

            {viewMode === HexagonViewMode.Group && (
              <>
                <UI.Icon color="gray.500">
                  <ChevronRight />
                </UI.Icon>

                <UI.Span ref={scrollRef} color="gray.500" mx={2} pr={2}>
                  Select a group
                </UI.Span>
              </>
            )}

            {viewMode === HexagonViewMode.Session && (
              <>
                <UI.Icon color="gray.500">
                  <ChevronRight />
                </UI.Icon>

                <UI.Span ref={scrollRef} color="gray.500" mx={2} pr={2}>
                  Select an individual
                </UI.Span>
              </>
            )}
          </UI.Flex>
        </LS.ControlBody>
      </UI.Flex>
    </LS.ControlContainer>
  );
};
