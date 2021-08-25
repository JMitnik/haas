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

    dialogueTree.nodes['LEVEL_1_POSITIVE'].title = 'SLIDER YOOs';

    console.log(dialogueTree.rootNode.isParentNodeOf[0]);
  });
})
