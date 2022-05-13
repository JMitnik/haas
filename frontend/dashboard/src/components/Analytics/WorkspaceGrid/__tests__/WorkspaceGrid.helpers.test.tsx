import { HexagonDialogueNode, HexagonGroupNode } from '../WorkspaceGrid.types';
import { groupsFromDialogues } from '../WorkspaceGrid.helpers';

import { dialogues } from './helpers';

describe('groupsFromDialogues', () => {
  test('groups sub-groups appropriately without duplicate groups', () => {
    const topNode = groupsFromDialogues(dialogues);
    expect((topNode[0]).type).toBe('Group');
    expect((topNode[0] as HexagonGroupNode).label).toBe('Male');
    // Ensure we have no more than 4 sub-groups
    expect((topNode[0] as HexagonGroupNode).subGroups).toHaveLength(4);
    expect((topNode[0] as HexagonGroupNode).subGroups[0].type).toBe('Group');
    expect((topNode[0] as HexagonGroupNode).subGroups[0].label).toBe('U8');

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
});
