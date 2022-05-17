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

  const average = meanBy(dialogues, (dialogue) => dialogue.dialogueStatisticsSummary?.impactScore ?? 0);

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
  if (score >= 40) return 'url(#dots-green)';
  return 'url(#dots-pink)';
};

export const getColorScoreBrand = (score?: number, darker?: boolean) => {
  if (!score) return 'gray.500';
  if (score >= 40) return `green.${darker ? '500' : '500'}`;
  return `red.${darker ? '700' : '500'}`;
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
