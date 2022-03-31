import { uniqBy } from 'lodash';

import { Dialogue, HexagonDialogueNode, HexagonGroupNode, HexagonNode, HexagonNodeType } from './WorkspaceGrid.types';

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

export const recursiveBuildGroup = (
  groupName: string,
  dialogueTitle: string,
  allGroups: GroupToChild[],
  dialogues: Dialogue[],
): HexagonGroupNode | HexagonDialogueNode => {
  const groupToChilds = allGroups.filter((group) => group.groupName === groupName);
  console.log({ groupToChilds });

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

  return {
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
