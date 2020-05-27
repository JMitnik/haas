import { act, renderHook } from '@testing-library/react-hooks';
import MockContainer from 'tests/mocks/MockContainer';
import React from 'react';
import wait from 'waait';

import useDialogueTree from './DialogueTreeProvider';

test('<DialogueTreeProvider /> renders without known project', () => {
  const { result } = renderHook(() => useDialogueTree(), { wrapper: MockContainer });

  // Check on initial state
  expect(result.current.treeState.currentDepth).toBe(0);
  expect(result.current.treeState.activeNode).toBe(null);
});

test('<DialogueTreeProvider /> updates once <ProjectProvider is updated />', async () => {
  const wrapper = ({ children }: { children?: React.ReactNode }) => <MockContainer baseUrl="/companyX/123">{children}</MockContainer>;
  const { result } = renderHook(() => useDialogueTree(), { wrapper });

  await act(async () => {
    await wait(0);
  });

  // Check that depth is not null, and that id is not falsy.
  expect(result.current.treeState.currentDepth).toBe(1);
  expect(result.current.treeState.activeNode?.id).toBeTruthy();
});
