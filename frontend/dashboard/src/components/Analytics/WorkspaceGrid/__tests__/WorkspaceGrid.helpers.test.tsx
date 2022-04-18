import { Dialogue, HexagonDialogueNode, HexagonGroupNode, HexagonNodeType } from '../WorkspaceGrid.types';
import { groupsFromDialogues } from '../WorkspaceGrid.helpers';

const sampleDialouges: Dialogue[] = [
  {
    id: '1',
    title: 'Group U8 Male - Team 1',
    dialogueStatisticsSummary: { id: '1', dialogueId: '1', impactScore: 20, nrVotes: 20 },
  },
  {
    id: '2',
    title: 'Group U8 Male - Team 2',
    dialogueStatisticsSummary: { id: '2', dialogueId: '2', impactScore: 50, nrVotes: 11 },
  },
  {
    id: '3',
    title: 'Group U8 Female - Team 1',
    dialogueStatisticsSummary: { id: '3', dialogueId: '3', impactScore: 42, nrVotes: 11 },
  },
  {
    id: '4',
    title: 'Group U8 Female - Team 2',
    dialogueStatisticsSummary: { id: '4', dialogueId: '4', impactScore: 32, nrVotes: 11 },
  },
  {
    id: '5',
    title: 'Group U9 Female - Team 1',
    dialogueStatisticsSummary: { id: '5', dialogueId: '5', impactScore: 37, nrVotes: 11 },
  },
];

describe('WorkspaceGrid helpers', () => {
  it('should find groups', () => {
    const groups = groupsFromDialogues(sampleDialouges);

    expect(groups).toHaveLength(3);
    expect(groups[0].type).toBe(HexagonNodeType.Group);
    expect((groups[0] as HexagonGroupNode).label).toBe('Group U8 Male');
    expect((groups[0] as HexagonGroupNode).subGroups).toHaveLength(2);
    expect((groups[0] as HexagonGroupNode).subGroups[0].type).toBe(HexagonNodeType.Dialogue);
    expect(((groups[0] as HexagonGroupNode).subGroups[0] as HexagonDialogueNode).dialogue.id).toBe('1');
    expect((groups[0] as HexagonGroupNode).subGroups[1].type).toBe(HexagonNodeType.Dialogue);
    expect(((groups[0] as HexagonGroupNode).subGroups[1] as HexagonDialogueNode).dialogue.id).toBe('2');
    expect((groups[0] as HexagonGroupNode).subGroups[0].label).toBe('Team 1');
    expect((groups[0] as HexagonGroupNode).subGroups[1].label).toBe('Team 2');

    expect(groups[1].type).toBe(HexagonNodeType.Group);
    expect((groups[1] as HexagonGroupNode).label).toBe('Group U8 Female');
    expect((groups[1] as HexagonGroupNode).subGroups).toHaveLength(2);
    expect((groups[1] as HexagonGroupNode).subGroups[0].type).toBe(HexagonNodeType.Dialogue);
    expect(((groups[1] as HexagonGroupNode).subGroups[0] as HexagonDialogueNode).dialogue.id).toBe('3');
    expect((groups[1] as HexagonGroupNode).subGroups[1].type).toBe(HexagonNodeType.Dialogue);
    expect(((groups[1] as HexagonGroupNode).subGroups[1] as HexagonDialogueNode).dialogue.id).toBe('4');
    expect((groups[1] as HexagonGroupNode).subGroups[0].label).toBe('Team 1');
    expect((groups[1] as HexagonGroupNode).subGroups[1].label).toBe('Team 2');
  });
});
