import React, { useState, useContext, ReactNode } from 'react';

export interface HAASNodeConditions {
  renderMin?: number;
  renderMax?: number;
}

type HAASQuestionNodeType = 'slider' | 'multi-choice' | 'text-box';
type HAASLeafType = 'textbox' | 'social-share';

export interface MultiChoiceOption {
  value: string;
  publicValue?: string;
}

export interface HAASNode {
  id: number;
  title: string;
  branchVal: string;
  conditions?: HAASNodeConditions;
  type?: HAASQuestionNodeType | HAASLeafType;
  setLeafID?: number;
  options?: [MultiChoiceOption];
  children: [HAASNode];
}

interface JSONTreeContextProps {
  activeNode: HAASNode;
  enterBranch: (key: string | number) => void;
}

export const JSONTreeContext = React.createContext({} as JSONTreeContextProps);

export const JSONTreeProvider = ({ json, children }: { json: any, children: ReactNode }) => {
  const [activeNode, setActiveNode] = useState(json.rootQuestion);

  const bagOfLeafNodes: [HAASNode] = json.LeafCollection;
  const [activeLeafNodeId, setActiveLeafNodeID] = useState(0);
  const getLeafNode = () => bagOfLeafNodes.filter(node => node.id == activeLeafNodeId)[0];

  const enterBranch = (key: string | number) => {
    // If current node overrides the current Call-To-Action
    // if (activeNode.setLeafID) {
    //   console.log(`Node has LeafID changing from ${activeLeafNodeId} to ${activeNode.setLeafID}`)
    //   setActiveLeafNodeID(activeNode.setLeafID);
    // }

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

      if (activeNode.type === 'multi-choice') {
        // If this check returns false for all children nodes it means the clicked multi-choice option there is no next node in tree => show a LeafNode 
        if (node.branchVal !== key) {
          return false;
        }
      }

      return true;
    });

    // If there is no next node, return the current Leaf
    if (nextNode.length === 0) {
      const leafNode = getLeafNode();
      console.log('Setting Leaf Node: ', leafNode)
      setActiveNode(leafNode);
      return
    }


    // Set the first node which matches the conditions
    // TODO: Ensure no other nodes have this.
    setActiveNode(nextNode[0]);

    // If clicked node has LeafNode ID override
    if (nextNode[0].setLeafID) {
      console.log(`Node has LeafID changing from ${activeLeafNodeId} to ${nextNode[0].setLeafID}`)
      setActiveLeafNodeID(nextNode[0].setLeafID);
    }
  }

  return (
    <JSONTreeContext.Provider value={{ activeNode, enterBranch }}>
      {children}
    </JSONTreeContext.Provider>
  );
};

export const useJSONTree = () => useContext(JSONTreeContext);
