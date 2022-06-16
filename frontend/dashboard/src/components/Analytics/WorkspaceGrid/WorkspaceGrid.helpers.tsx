import { GREEN_LOWER_BOUND, ORANGE_LOWER_BOUND } from 'config/constants';
import { Grid, Hex, createHexPrototype, rectangle } from 'honeycomb-grid';
import { meanBy, orderBy, uniqBy } from 'lodash';

import {
  Dialogue,
  DialogueGroup,
  HexagonDialogueNode,
  HexagonGroupNode,
  HexagonGroupNodeStatics,
  HexagonNode,
  HexagonNodeType,
  HexagonState,
  HexagonViewMode,
} from './WorkspaceGrid.types';

/**
 * Parse group names based on agreed dialogue standard.
 * Example: "Fold 1 - Group 1 - Team 1" => Fold 1, Group 1, Team 1
 */
export const parseGroupNames = (title: string): string[] => {
  const groups = title.split('-').map((group) => group.trim());
  return groups;
};

interface GroupToChild {
  height: number;
  dialogueTitle: string;
  groupName: string;
  groupFragments: string;
  childGroupFragments: string | null;
  childGroupName: string | null;
}

/**
 * Parses a dialogue-group into a list of group relations.
 */
export const parseDialogueGroup = (dialogueGroup: DialogueGroup): GroupToChild[] => (
  dialogueGroup.groupFragments.map((groupFragment, index) => ({
    height: dialogueGroup.groupFragments.length - index - 1,
    dialogueTitle: dialogueGroup.dialogueTitle,
    groupName: groupFragment,
    groupFragments: dialogueGroup.groupFragments.slice(0, index + 1).join(' - '),
    childGroupFragments: (
      index === dialogueGroup.groupFragments.length - 1
        ? null
        : dialogueGroup.groupFragments.slice(0, index + 2).join(' - ')
    ),
    childGroupName: index === dialogueGroup.groupFragments.length - 1 ? null : dialogueGroup.groupFragments[index + 1],
  }))
);

export const calcGroupAverage = (group: HexagonGroupNode): number => {
  if (typeof group.subGroups === 'undefined') return 0;

  // @ts-ignore
  return meanBy(group.subGroups, (subGroup) => {
    // @ts-ignore
    if (typeof subGroup === 'object' && subGroup.type === HexagonNodeType.Dialogue) {
      // @ts-ignore
      return subGroup.dialogue.dialogueStatisticsSummary?.impactScore ?? 0;
    }

    return 0;
  });
};

export const calcGroupTotal = (group: HexagonGroupNode): number => {
  if (typeof group.subGroups === 'undefined') return 0;

  // @ts-ignore
  return group.subGroups.reduce<number>((acc, subGroup) => {
    if (typeof subGroup === 'object' && subGroup.type === HexagonNodeType.Dialogue) {
      acc += subGroup.dialogue.dialogueStatisticsSummary?.nrVotes ?? 0;
    }

    return acc;
  }, 0 as number);
};

/**
 * Gets all dialogues belonging to a particular group.
 *
 * NOTE: This is very instable, as it only works for dialogues following the A - B - C pattern.
 * TODO: Refactor this to work for any number of groups, and any dialogue titles.
 */
const filterDialogues = (groupFragments: string, dialogues: Dialogue[]): Dialogue[] => (
  dialogues.filter((dialogue) => dialogue.title.startsWith(groupFragments))
);

/**
 * Calculate statistics for a group node.
 */
export const calcGroupStatistics = (dialogues: Dialogue[]): HexagonGroupNodeStatics => {
  const voteCount = dialogues.reduce<number>((acc, dialogue) => (
    acc + (dialogue.dialogueStatisticsSummary?.nrVotes ?? 0)
  ), 0);

  const filteredDialogues = dialogues.filter((dialogue) => dialogue.dialogueStatisticsSummary?.impactScore
    && dialogue.dialogueStatisticsSummary?.impactScore > 0);

  const average = voteCount > 0
    ? meanBy(filteredDialogues, (dialogue) => dialogue.dialogueStatisticsSummary?.impactScore)
    : 0;

  return {
    voteCount,
    score: average,
  };
};

/**
 * Traverses all dialogues based on a shared group-name.
 */
export const recursiveBuildGroup = (
  groupName: string,
  groupFragments: string,
  dialogueTitle: string,
  allGroups: GroupToChild[],
  dialogues: Dialogue[],
): HexagonGroupNode | HexagonDialogueNode => {
  const groupToChilds = allGroups.filter((group) => group.groupFragments === groupFragments);
  // Ensure only unique groups are considered
  const uniqueGroupToChilds = uniqBy(groupToChilds, 'childGroupFragments');

  // If no child groups, we are at the "dialogue title" level: return a dialogue node
  if (groupToChilds.length === 0 || groupToChilds[0].height === 0) {
    const relevantDialogue = dialogues.find((dialogue) => dialogue.title === dialogueTitle) as Dialogue;

    return {
      id: relevantDialogue.id,
      type: HexagonNodeType.Dialogue,
      dialogue: relevantDialogue,
      label: groupName,
      score: relevantDialogue.dialogueStatisticsSummary?.impactScore || 0,
      points: undefined,
    } as HexagonDialogueNode;
  }

  const groupDialogues = filterDialogues(groupFragments, dialogues);
  const groupStatistics = calcGroupStatistics(groupDialogues);

  return {
    id: groupName,
    type: HexagonNodeType.Group,
    label: groupName,
    statistics: groupStatistics,
    score: groupStatistics.score,
    subGroups: uniqueGroupToChilds.map((groupToChild) => recursiveBuildGroup(
      groupToChild.childGroupName!,
      groupToChild.childGroupFragments || '',
      groupToChild.dialogueTitle,
      allGroups,
      dialogues,
    )),
  } as HexagonGroupNode;
};

export const dialogueToNode = (dialogue: Dialogue): HexagonNode => ({
  id: dialogue.id,
  type: HexagonNodeType.Dialogue,
  label: dialogue.title,
  score: dialogue.dialogueStatisticsSummary?.impactScore ?? 0,
  dialogue,
});

/**
 * Group dialogues into hierarchical groups.
 */
export const groupsFromDialogues = (dialogues: Dialogue[]): HexagonNode[] => {
  const dialogueGroups: DialogueGroup[] = dialogues.map((dialogue) => ({
    groupFragments: parseGroupNames(dialogue.title),
    dialogueTitle: dialogue.title,
  }));

  const groupToChild: GroupToChild[] = dialogueGroups.flatMap(parseDialogueGroup);

  const maxHeight = Math.max(...groupToChild.map((group) => group.height));

  if (maxHeight === 0) return dialogues.map((dialogue) => dialogueToNode(dialogue));

  const topGroups = uniqBy(groupToChild.filter((group) => group.height === maxHeight), 'groupName');

  const topGroupNodes = topGroups.map((group) => (
    recursiveBuildGroup(
      group.groupName,
      group.groupFragments,
      group.dialogueTitle,
      groupToChild,
      dialogues,
    )
  ));

  return topGroupNodes;
};

export const orderNodesByVoteCount = (nodes: HexagonNode[]): HexagonNode[] => orderBy(nodes, ((node) => {
  if (typeof node !== 'object') return 0;

  if (node.type === HexagonNodeType.Dialogue) {
    return node.dialogue.dialogueStatisticsSummary?.nrVotes;
  }

  if (node.type === HexagonNodeType.Topic) {
    return 0;
  }

  if (node.type === HexagonNodeType.Session) {
    return 0;
  }

  return 0;
}), 'desc');

export const orderNodesByScore = (nodes: HexagonNode[]): HexagonNode[] => orderBy(nodes, ((node) => {
  if (typeof node !== 'object') return 0;

  if (node.type === HexagonNodeType.Dialogue) {
    return node.dialogue.dialogueStatisticsSummary?.impactScore;
  }

  if (node.type === HexagonNodeType.Topic) {
    return node.score;
  }

  if (node.type === HexagonNodeType.Session) {
    return node.score;
  }

  return node.score;
}), 'desc');

export const getHexagonSVGFill = (score?: number) => {
  if (!score) return 'url(#dots-gray)';
  if (score >= GREEN_LOWER_BOUND) return 'url(#dots-green)';
  if (score < GREEN_LOWER_BOUND && score >= ORANGE_LOWER_BOUND) return 'url(#dots-orange)';

  return 'url(#dots-pink)';
};

export const getColorScoreBrandVariable = (score?: number, darker?: boolean) => {
  if (!score) return 'gray.500';
  if (score >= GREEN_LOWER_BOUND) return `green.${darker ? '500' : '500'}`;
  if (score < GREEN_LOWER_BOUND && score >= ORANGE_LOWER_BOUND) return 'warning';
  return `red.${darker ? '700' : '500'}`;
};

export const getColorScoreState = (score?: number) => {
  if (!score) return 'gray';

  if (score >= GREEN_LOWER_BOUND) return 'green';
  if (score < GREEN_LOWER_BOUND && score >= ORANGE_LOWER_BOUND) return 'orange';

  return 'red';
};

type HexagonTitleState = 'workspace' | 'groups' | 'dialogues' | 'individuals';

/**
 * Gets the state of the title of the hexagon grid.
 *
 * This is based on whether we have any selected-node (if not, 'workspace-level'), and else on the type of any child.
 * Note: If any child have different types, then this function is not sutiable any longer.
 * @param state - The current state of the hexagon grid.
 * @returns The state of the title of the hexagon grid.
 */
export const getTitleKey = (state: HexagonState): HexagonTitleState => {
  switch (state.viewMode) {
    case (HexagonViewMode.Workspace): { return 'workspace'; }
    case (HexagonViewMode.Group): { return 'groups'; }
    case (HexagonViewMode.Dialogue): { return 'dialogues'; }
    default: { return 'individuals'; }
  }
};

/**
 * Creates a grid of hexagons with the given number of rows and columns.
 * @param nrItems
 * @param windowHeight
 * @param windowWidth
 * @returns
 */
export const createGrid = (nrItems: number, windowHeight: number, windowWidth: number) => {
  const gridItems: any[] = [];
  const squareRoot = Math.sqrt(nrItems);
  const ratioWindow = windowWidth / windowHeight;
  const itemsPerRow = Math.ceil(squareRoot * ratioWindow) || 1;
  const itemsPerColumn = Math.ceil(squareRoot) || 1;
  const dimensions = Math.floor((windowWidth / itemsPerRow) / 2);

  const hexPrototype = createHexPrototype({
    dimensions,
    offset: 1,
  });

  new Grid(hexPrototype, rectangle({ start: [0, 0], width: itemsPerRow, height: itemsPerColumn }))
    .each((hex: Hex) => {
      const corners = hex.corners.map(({ x, y }) => `${x},${y}`);
      gridItems.push(corners.join(' '));
    }).run();

  return {
    points: gridItems,
    strokeWidth: itemsPerRow,
  };
};

export const mapNodeTypeToViewType = (nodeType: HexagonNodeType): HexagonViewMode => {
  switch (nodeType) {
    case HexagonNodeType.Dialogue:
      return HexagonViewMode.Dialogue;
    case HexagonNodeType.Topic:
      return HexagonViewMode.Topic;
    case HexagonNodeType.Session:
      return HexagonViewMode.Session;
    case HexagonNodeType.Group:
      return HexagonViewMode.Group;
    default:
      return HexagonViewMode.Dialogue;
  }
};

/**
   * Traverses HexagonNode data set to find the path to the Dialogue HexagonNode
   * matching dialogue ID provided as parameter
   * @param dialogueId
   * @param data the root HexagonNode[] data set
   * @param path an array to store the traversed HexagonNode IDs
   * @returns a list of HexagonNode IDs to reach the Dialogue HexagonNode
   */
export const findDialoguePath = (
  dialogueId: string, data: HexagonNode[], path: string[] = [],
): string[] => data.flatMap((node) => {
  // If current node is a group node we have to go one layer deeper while keep tracking the traversed node IDs
  if (node.type === HexagonNodeType.Dialogue) {
    if (node.id === dialogueId) {
      return [...path, node.id];
    }
  }

  if (node.type === HexagonNodeType.Group) {
    return findDialoguePath(dialogueId, node.subGroups, [...path, node.id]);
  }

  return undefined;
}).filter((entry: any) => entry) as string[];

/**
 * Recursively traverses the HexagonNode data set and reconstructs the history stack
 * based on a list of provided HexagonNode IDs (the 'path')
 * @param data the root HexagonNode[] data set
 * @param path an array containing HexagonNode IDs
 * @param states a list of HexagonState[] entries representing the HistoryStack
 * @returns a HistoryStack based on the provided HexagonNode IDs
 */
export const pathToHistoryStack = (
  data: HexagonNode[],
  path: string[],
  states: HexagonState[] = [],
): HexagonState[] => {
  const nodeId = path[0];

  // Pop first entry from path list
  path.shift();

  if (!nodeId) return states;

  const groupNode = data.find((node) => node.id === nodeId) as HexagonGroupNode | HexagonDialogueNode;

  if (!groupNode) return states;

  // Use last added state as currentNode to mimic 'clicking' on it in the overview
  const hexagonStateEntry: HexagonState = {
    currentNode: states?.[0]?.selectedNode,
    childNodes: data,
    selectedNode: groupNode,
    viewMode: mapNodeTypeToViewType(groupNode.type),
  };

  // Add new HistoryStack entry on top of the stack
  states.unshift(hexagonStateEntry);

  if (path.length === 0) {
    return states;
  }

  // Continue adding HistoryStack entries until we run out of HexagonNode IDs
  return pathToHistoryStack(
    (groupNode as HexagonGroupNode)?.subGroups || [] as any,
    path,
    states,
  );
};

/**
 * Finds path (HexagonNode ID[]) to a dialogue hexagon node and uses that to reconstruct a History Stack
 * @param dialogueId the ID of a dialogue
 * @param data HexagonNode data set
 * @returns a HistoryStack
 */
export const reconstructHistoryStack = (dialogueId: string, data: HexagonNode[]): HexagonState[] => {
  const path = findDialoguePath(dialogueId, data);
  if (!path) return [];

  return pathToHistoryStack(
    data,
    path,
  );
};

export const extractDialogueFragments = (historyQueue: HexagonState[]): string[] => {
  const fragments: string[] = [];

  historyQueue.forEach((pastState) => {
    if (!pastState.selectedNode) return;

    if (
      pastState.selectedNode.type === HexagonNodeType.Group
      || pastState.selectedNode.type === HexagonNodeType.Dialogue
    ) {
      fragments.push(pastState.selectedNode.label);
    }
  });

  return fragments;
};
