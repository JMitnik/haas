import { HexagonDialogueNode, HexagonGroupNode } from '../WorkspaceGrid.types';
import { groupsFromDialogues, parseDialogueGroup } from '../WorkspaceGrid.helpers';

import { dialogues } from './helpers';

describe('groupsFromDialogues', () => {
  test('groups sub-groups appropriately without duplicate groups', () => {
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

  test('groups top-groups with different layer sizes appropriately', () => {
    const topNodes = groupsFromDialogues([
      ...dialogues,
      {
        id: '_',
        dialogue: {
          id: '_D',
          title: 'Neutral - Happy',
        },
        impactScore: 0,
        nrVotes: 10,
        title: 'Neutral - Happy',
        updatedAt: '1656506578366',
      },
    ]);

    expect(topNodes.length).toBe(3);
    expect((topNodes[0]).type).toBe('Group');
    expect((topNodes[1]).type).toBe('Group');
    expect((topNodes[2]).type).toBe('Group');
    expect((topNodes[0] as HexagonGroupNode).label).toBe('Male');
    expect((topNodes[1] as HexagonGroupNode).label).toBe('Female');
    expect((topNodes[2] as HexagonGroupNode).label).toBe('Neutral');
  });
});
describe('parseDialogueGroup', () => {
  test('group fragments appropriately for three height', () => {
    const groups = parseDialogueGroup({
      dialogueTitle: 'Male - U8 - Team1',
      groupFragments: ['Male', 'U8', 'Team1'],
    });

    expect(groups[0].parentGroupName).toBe('Male');
    expect(groups[0].parentGroupFragments).toBe('Male');
    expect(groups[0].height).toBe(0);
    expect(groups[0].childGroupName).toBe('U8');
    expect(groups[0].childGroupFragments).toBe('Male - U8');

    expect(groups[1].parentGroupName).toBe('U8');
    expect(groups[1].parentGroupFragments).toBe('Male - U8');
    expect(groups[1].height).toBe(1);
    expect(groups[1].childGroupName).toBe('Team1');
    expect(groups[1].childGroupFragments).toBe('Male - U8 - Team1');

    expect(groups[2].parentGroupName).toBe('Team1');
    expect(groups[2].parentGroupFragments).toBe('Male - U8 - Team1');
    expect(groups[2].height).toBe(2);
    expect(groups[2].childGroupName).toBe(null);
    expect(groups[2].childGroupFragments).toBe(null);
  });

  test('group fragments appropriately for two high', () => {
    const groups = parseDialogueGroup({
      dialogueTitle: 'Neutral - Happy',
      groupFragments: ['Neutral', 'Happy'],
    });

    expect(groups.length).toBe(2);

    expect(groups[0].parentGroupName).toBe('Neutral');
    expect(groups[0].parentGroupFragments).toBe('Neutral');
    expect(groups[0].height).toBe(0);
    expect(groups[0].childGroupName).toBe('Happy');
    expect(groups[0].childGroupFragments).toBe('Neutral - Happy');

    expect(groups[1].parentGroupName).toBe('Happy');
    expect(groups[1].parentGroupFragments).toBe('Neutral - Happy');
    expect(groups[1].height).toBe(1);
    expect(groups[1].childGroupName).toBe(null);
    expect(groups[1].childGroupFragments).toBe(null);
  });
});
