import { Grid, Hex, createHexPrototype, rectangle } from 'honeycomb-grid';
import { meanBy, orderBy, uniqBy } from 'lodash';

import {
  Dialogue,
  HexagonDialogueNode,
  HexagonGroupNode,
  HexagonNode,
  HexagonNodeType,
  HexagonViewMode,
} from './WorkspaceGrid.types';

export const parseGroupNames = (title: string): string[] => {
  const groups = title.split('-').map((group) => group.trim());
  return groups;
};

interface DialogueGroup {
  groupFragments: string[];
  dialogueTitle: string;
}

interface GroupToChild {
  height: number;
  dialogueTitle: string;
  groupName: string;
  childGroupName: string | null;
}

export const parseDialogueGroup = (dialogueGroup: DialogueGroup): GroupToChild[] => (
  dialogueGroup.groupFragments.map((groupFragment, index) => ({
    height: dialogueGroup.groupFragments.length - index - 1,
    dialogueTitle: dialogueGroup.dialogueTitle,
    groupName: groupFragment,
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

export const recursiveBuildGroup = (
  groupName: string,
  dialogueTitle: string,
  allGroups: GroupToChild[],
  dialogues: Dialogue[],
): HexagonGroupNode | HexagonDialogueNode => {
  const groupToChilds = allGroups.filter((group) => group.groupName === groupName);

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

  const group = {
    id: groupName,
    type: HexagonNodeType.Group,
    label: groupName,
    subGroups: groupToChilds.map((groupToChild) => recursiveBuildGroup(
      groupToChild.childGroupName!,
      groupToChild.dialogueTitle,
      allGroups,
      dialogues,
    )),
  } as HexagonGroupNode;

  return { ...group, score: calcGroupAverage(group) };
};

export const dialogueToNode = (dialogue: Dialogue): HexagonNode => ({
  id: dialogue.id,
  type: HexagonNodeType.Dialogue,
  label: dialogue.title,
  score: dialogue.dialogueStatisticsSummary?.impactScore ?? 0,
  dialogue,
});

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
    recursiveBuildGroup(group.groupName, group.dialogueTitle, groupToChild, dialogues)
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

  return gridItems;
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
