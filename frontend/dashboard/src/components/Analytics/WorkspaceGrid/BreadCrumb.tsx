import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import * as UI from '@haas/ui';
import { ChevronRight, Filter, Home } from 'react-feather';

import * as LS from './WorkspaceGrid.styles';
import { HexagonState, HexagonViewMode } from './WorkspaceGrid.types';

interface BreadCrumbProps {
  viewMode: HexagonViewMode;
  historyQueue: HexagonState[];
  onJumpToIndex: (index: number) => void;
}

export const BreadCrumb = ({ historyQueue, viewMode, onJumpToIndex }: BreadCrumbProps) => {
  const { t } = useTranslation();

  return (
    <LS.ControlContainer width="auto" as="span">
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
            <UI.Button onClick={() => onJumpToIndex(0)} isDisabled={historyQueue.length === 0} variantColor='gray' variant='ghost' size="sm">
              <UI.Icon>
                <Home />
              </UI.Icon>
            </UI.Button>

            {historyQueue.map((state, index) => (
              <React.Fragment key={state.selectedNode?.id}>
                <UI.Icon>
                  <ChevronRight />
                </UI.Icon>

                <UI.Button onClick={() => onJumpToIndex(index + 1)} variantColor='gray' variant='ghost' size="sm">
                  {state.selectedNode?.label}
                </UI.Button>
              </React.Fragment>
            ))}

            {viewMode === HexagonViewMode.Dialogue && (
              <>
                <UI.Icon color="gray.500">
                  <ChevronRight />
                </UI.Icon>

                <UI.Span color="gray.500" mx={2}>
                  Select a team
                </UI.Span>
              </>
            )}

            {viewMode === HexagonViewMode.Group && (
              <>
                <UI.Icon color="gray.500">
                  <ChevronRight />
                </UI.Icon>

                <UI.Span color="gray.500" mx={2}>
                  Select a group
                </UI.Span>
              </>
            )}

            {viewMode === HexagonViewMode.Session && (
              <>
                <UI.Icon color="gray.500">
                  <ChevronRight />
                </UI.Icon>

                <UI.Span color="gray.500" mx={2}>
                  Select an individual
                </UI.Span>
              </>
            )}

          </UI.Flex>
        </LS.ControlBody>
      </UI.Flex>
    </LS.ControlContainer>
  )
}
