import { HexagonDialogueNode, HexagonGroupNode } from '../WorkspaceGrid.types';
import { groupsFromDialogues, parseDialogueGroup } from '../WorkspaceGrid.helpers';

import { dialogues } from './helpers';

describe('groupsFromDialogues', () => {
  test('groups sub-groups appropriately without duplicate groups', () => {
    console.log('Dialogues: ', dialogues);
    const topNode = groupsFromDialogues(dialogues);
    expect((topNode[0]).type).toBe('Group');
    expect((topNode[0] as HexagonGroupNode).label).toBe('Male');

    // Ensure we have all the ratings from the underlying dialogues
    expect((topNode[0] as HexagonGroupNode).statistics?.voteCount).toBe(60);

    // Ensure we have no more than 4 sub-groups
    expect((topNode[0] as HexagonGroupNode).subGroups).toHaveLength(4);
    expect((topNode[0] as HexagonGroupNode).subGroups[0].type).toBe('Group');
    expect((topNode[0] as HexagonGroupNode).subGroups[0].label).toBe('U8');

    // Ensure our sub-groups have the correct number of votes
    expect(((topNode[0] as HexagonGroupNode).subGroups[0] as HexagonGroupNode).statistics?.voteCount).toBe(15);

    // Ensure we have no more than 3 sub-grups
    expect(((topNode[0] as HexagonGroupNode).subGroups[0] as HexagonGroupNode).subGroups).toHaveLength(3);
    expect(((topNode[0] as HexagonGroupNode).subGroups[0] as HexagonGroupNode).subGroups[0].type).toBe('Dialogue');
    expect(((topNode[0] as HexagonGroupNode).subGroups[0] as HexagonGroupNode).subGroups[0].label).toBe('Team1');
    expect(
      (((
        topNode[0] as HexagonGroupNode).subGroups[0] as HexagonGroupNode).subGroups[0] as HexagonDialogueNode
      ).dialogue.title,
    ).toBe('Male - U8 - Team1');
  });

  test('group fragments appropriately', () => {
    const groups = parseDialogueGroup({
      dialogueTitle: 'Male - U8 - Team1',
      groupFragments: ['Male', 'U8', 'Team1'],
    });

    expect(groups[0].groupName).toBe('Male');
    expect(groups[0].groupFragments).toBe('Male');
    expect(groups[0].height).toBe(2);
    expect(groups[0].childGroupName).toBe('U8');
    expect(groups[0].childGroupFragments).toBe('Male - U8');

    expect(groups[1].groupName).toBe('U8');
    expect(groups[1].groupFragments).toBe('Male - U8');
    expect(groups[1].height).toBe(1);
    expect(groups[1].childGroupName).toBe('Team1');
    expect(groups[1].childGroupFragments).toBe('Male - U8 - Team1');

    expect(groups[2].groupName).toBe('Team1');
    expect(groups[2].groupFragments).toBe('Male - U8 - Team1');
    expect(groups[2].height).toBe(0);
    expect(groups[2].childGroupName).toBe(null);
    expect(groups[2].childGroupFragments).toBe(null);
  });
});
