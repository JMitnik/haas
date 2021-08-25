import { clearDialogueDatabase, createTestDialogue } from './testUtils';
import { DialogueStatisticsPrismaAdapter } from '../DialogueStatisticsPrismaAdapter';
import { makeTestPrisma } from '../../../test/utils/makeTestPrisma';
import { DialogueTree } from '../entities/DialogueTree';

const prisma = makeTestPrisma();
const dialogueServicePrismaService = new DialogueStatisticsPrismaAdapter(prisma);

describe('DialogueTree', () => {
  afterEach(async () => {
    await clearDialogueDatabase(prisma);
    await prisma.$disconnect();
  });

  test('initializes tree from prisma nodes', async () => {
    // Prep: create dialogue and fetch nodes/edges
    const createdDialogue = await createTestDialogue(prisma);
    const { nodes, edges } = await dialogueServicePrismaService.getNodesAndEdges(createdDialogue.id);

    const dialogueTree = new DialogueTree().initFromPrismaNodes(nodes, edges);

    expect(dialogueTree?.rootNode?.id).toBe('SLIDER_ROOT');
    expect(dialogueTree?.rootNode?.isParentNodeOf).toHaveLength(3);
  });

  test('gets branches by slider-root', async () => {
    // Prep: create dialogue and fetch nodes/edges
    const createdDialogue = await createTestDialogue(prisma);
    const { nodes, edges } = await dialogueServicePrismaService.getNodesAndEdges(createdDialogue.id);

    const dialogueTree = new DialogueTree().initFromPrismaNodes(nodes, edges);
    const branches = dialogueTree.getBranchesByRootSlider();

    expect(branches.positiveBranch.rootEdge.childNode.id).toBe('LEVEL_1_POSITIVE');
    expect(branches.negativeBranch.rootEdge.childNode.id).toBe('LEVEL_1_NEGATIVE');
  });

  test('add node-entries to tree', async () => {
    // Prep: create dialogue and fetch nodes/edges
    const createdDialogue = await createTestDialogue(prisma);
    const { nodes, edges } = await dialogueServicePrismaService.getNodesAndEdges(createdDialogue.id);
    const dialogueTree = new DialogueTree().initFromPrismaNodes(nodes, edges);

    dialogueTree.addNodeCounts({ 'LEVEL_1_NEGATIVE': 22 });

    expect(dialogueTree.nodes['LEVEL_1_NEGATIVE']?.summary?.nrEntries).toEqual(22);
  });

  test('can calculate visit rate', async () => {
    // Prep: create dialogue and fetch nodes/edges
    const createdDialogue = await createTestDialogue(prisma);
    const { nodes, edges } = await dialogueServicePrismaService.getNodesAndEdges(createdDialogue.id);
    const dialogueTree = new DialogueTree().initFromPrismaNodes(nodes, edges);

    dialogueTree.addNodeCounts({ 'LEVEL_1_POSITIVE': 20, 'LEVEL_1_NEUTRAL': 20 ,'LEVEL_1_NEGATIVE': 60 });
    dialogueTree.calculateNodeRate();

    expect(dialogueTree.nodes['LEVEL_1_NEGATIVE'].summary?.visitRate).toEqual(0.6);
    // Unvisited nodes
    expect(dialogueTree.nodes['LEVEL_2_NEGATIVE_Facilities'].summary?.visitRate).toEqual(0.0);
  });
})
