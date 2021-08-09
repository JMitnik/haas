import { makeTestPrisma } from "../../../test/utils/makeTestPrisma";
import NodeService from "../../QuestionNode/NodeService";
import { DialogueStatisticsPrismaAdapter } from "../DialogueStatisticsPrismaAdapter";
import { clearDialogueDatabase, createFewInteractions, createTestDialogue }  from './testUtils';

const prisma = makeTestPrisma();
const nodeService = new NodeService(prisma);
const dialogueStatisticsPrismaAdapter = new DialogueStatisticsPrismaAdapter(prisma);

describe('DialogueStatisticsService', () => {
  afterEach(async () => {
    await clearDialogueDatabase(prisma);
    await prisma.$disconnect();
  });

  test('it can fetch all counts by node-entries for a dialogue with a few entries', async () => {
    const createdDialogue = await createTestDialogue(prisma);
    await createFewInteractions(prisma);

    const nodeEntriesCount = await dialogueStatisticsPrismaAdapter.countNodeEntriesByRootBranch(
      createdDialogue.id,
      10,
      30
    );

    expect(nodeEntriesCount.find(nodeEntry => nodeEntry?.relatedNodeId === 'SLIDER_ROOT')._count).toEqual(2);
    expect(nodeEntriesCount.find(nodeEntry => nodeEntry?.relatedNodeId === 'LEVEL_1_NEGATIVE')._count).toEqual(2);
    expect(nodeEntriesCount.find(nodeEntry => nodeEntry?.relatedNodeId === 'LEVEL_2_NEGATIVE_Facilities')._count).toEqual(1);
  });

  test('it can return nodes with their count for each specific branch', async () => {
    const createdDialogue = await createTestDialogue(prisma);
    await createFewInteractions(prisma);

    const negativeNodes = await dialogueStatisticsPrismaAdapter.getNodeStatisticsByRootBranch(
      createdDialogue.id,
      0,
      30
    );

    console.log(negativeNodes);
  });

  test('it can find the sub-root node of a negative branch', async () => {
    const createdDialogue = await createTestDialogue(prisma);
    await createFewInteractions(prisma);
    const nodesAndEdges = await dialogueStatisticsPrismaAdapter.getNodesAndEdges(createdDialogue.id);

    const subRootNode = dialogueStatisticsPrismaAdapter.findSubRootNode(
      nodesAndEdges.nodes,
      0,
      30
    );

    expect(subRootNode.id).toEqual('LEVEL_1_NEGATIVE');
  });

  test('it can find the entire nodes of an entire sub-branch', async () => {
    const createdDialogue = await createTestDialogue(prisma);
    await createFewInteractions(prisma);
    const nodesAndEdges = await dialogueStatisticsPrismaAdapter.getNodesAndEdges(createdDialogue.id);

  });
})
