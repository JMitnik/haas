import { renderHook } from '@testing-library/react-hooks';
import { render } from "@testing-library/react";
import React from "react";
import useProject, { ProjectProvider } from "../ProjectProvider";
import useDialogueTree, { DialogueTreeProvider } from './DialogueTreeProvider';

test('<ProjectProvider /> renders', () => {
    render(
        <ProjectProvider>
            <></>
        </ProjectProvider>
    );
});


const MockChild = ({ children }: { children?: React.ReactNode }) => {

  return (
    <>
      {children}
    </>
  );
};

const MockProviders = ({children}: { children?: React.ReactNode }) => (
  <ProjectProvider>
      <DialogueTreeProvider>
        <MockChild>
          {children}
        </MockChild>
      </DialogueTreeProvider>
  </ProjectProvider>
);

test('<DialogueTreeProvider /> renders without known project', () => {
    const { result } = renderHook(() => useDialogueTree(), { wrapper: MockProviders });

    // Check on initial state
    expect(result.current.treeState.currentDepth).toBe(0);
    expect(result.current.treeState.activeNode).toBe(null);
});

test('<DialogueTreeProvider /> gets set once project is set', () => {
    const { result } = renderHook(() => useDialogueTree(), { wrapper: MockProviders });

    // Check that first is empty
    expect(result.current.treeState.currentDepth).toBe(0);
    expect(result.current.treeState.activeNode).toBe(null);
});
