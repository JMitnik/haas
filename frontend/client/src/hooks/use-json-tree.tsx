import React, { useState, useContext, ReactNode } from 'react';

export interface HAASNodeConditions {
  renderMin?: number;
  renderMax?: number;
}

export interface HAASNode {
  title: string;
  branchVal?: string;
  conditions?: HAASNodeConditions;
  type?: "slider" | "multi-choice" | "text-box";
  children: [HAASNode?];
}

interface JSONTreeContextProps {
  activeNode: HAASNode;
  enterBranch: (node: string) => void
}

export const JSONTreeContext = React.createContext({} as JSONTreeContextProps);

export const JSONTreeProvider = ({ json, children }: { json: any, children: ReactNode }) => {
  const [activeNode, setActiveNode] = useState(json);

  const enterBranch = (key: string | number) => {
    // Slider does it numerically
    if (activeNode.type === "slider") {
      // Find the next node meeting the condition
      const nextNode = activeNode.children?.filter((
        node: HAASNode) => {
          if (node?.conditions?.renderMin && key < node?.conditions?.renderMin) {
            return false;
          }

          if (node?.conditions?.renderMax && key > node?.conditions?.renderMax) {
            return false;
          }

          return true;
      });

      if (nextNode.length === 0) {
        console.log("Can't find any children");
        return;
        // TODO: Make a flow
      }

      setActiveNode(nextNode[0]);
    }
  }

  return (
    <JSONTreeContext.Provider value={{activeNode, enterBranch}}>
      {children}
    </JSONTreeContext.Provider>
  );
};

export const useJSONTree = () => useContext(JSONTreeContext);
