import React, { useState, useContext, ReactNode } from 'react';

export interface HAASNodeConditions {
  renderMin?: number;
  renderMax?: number;
}

type HAASQuestionNodeType = 'slider' | 'multi-choice' | 'text-box';
type HAASCTAType = 'textbox' | 'social-share';

export interface HAASNode {
  id: number;
  title: string;
  branchVal?: string;
  conditions?: HAASNodeConditions;
  type?: HAASQuestionNodeType | HAASCTAType;
  setCTAID?: number;
  children: [HAASNode?];
}

interface JSONTreeContextProps {
  activeNode: HAASNode;
  enterBranch: (node: string) => void;
  getCTANode: () => HAASNode;
}

export const JSONTreeContext = React.createContext({} as JSONTreeContextProps);

export const JSONTreeProvider = ({ json, children }: { json: any, children: ReactNode }) => {
  const [activeNode, setActiveNode] = useState(json.rootQuestion);

  const bagOfCTANodes: [HAASNode] = json.CTACollection;
  const [activeCTANodeId, setActiveCTANodeID] = useState(0);
  const getCTANode = () => bagOfCTANodes.filter(node => node.id === activeCTANodeId)[0];

  const enterBranch = (key: string | number) => {
    // If current node overrides the current Call-To-Action
    if (activeNode.setCTAID) {
      setActiveCTANodeID(activeNode.setCTAID);
    }

    // Slider does it numerically
    // Find the next node meeting the condition
    const nextNode = activeNode.children?.filter((node: HAASNode) => {
      // If slider, check if key is between min and max
      if (activeNode.type === 'slider') {
        if (node?.conditions?.renderMin && key < node?.conditions?.renderMin) {
          return false;
        }

        if (node?.conditions?.renderMax && key > node?.conditions?.renderMax) {
          return false;
        }
      }

      return true;
    });

    // If there is no next node, return the current CTA
    if (nextNode.length === 0) {
      setActiveNode(getCTANode());
      return
    }


      // Set the first node which matches the conditions
      // TODO: Ensure no other nodes have this.
      setActiveNode(nextNode[0]);
    }

  return (
    <JSONTreeContext.Provider value={{activeNode, enterBranch, getCTANode}}>
      {children}
    </JSONTreeContext.Provider>
  );
};

export const useJSONTree = () => useContext(JSONTreeContext);
