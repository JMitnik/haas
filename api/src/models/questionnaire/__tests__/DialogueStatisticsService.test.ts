import { parse } from "date-fns";
import { makeRedis } from "../../../config/redis";
import { makeTestPrisma } from "../../../test/utils/makeTestPrisma";
import NodeService from "../../QuestionNode/NodeService";
import { DialogueStatisticsPrismaAdapter } from "../DialogueStatisticsPrismaAdapter";
import { DialogueStatisticsService } from "../DialogueStatisticsService";
import { clearDialogueDatabase, createFewInteractions, createTestDialogue }  from './testUtils';

const prisma = makeTestPrisma();
const prismaAdapter = new DialogueStatisticsPrismaAdapter(prisma);
const redis = makeRedis('redis://localhost:6378');

const dialogueStatisticsService = new DialogueStatisticsService(
  prisma,
  prismaAdapter,
  redis,
);

describe('DialogueStatisticsService.getGroupbyFromDates', () => {
  afterEach(async () => {
    await clearDialogueDatabase(prisma);
    await prisma.$disconnect();
  });

  test('it groups by day for more than 10 days', async () => {
    const groupBy = dialogueStatisticsService.getGroupbyFromDates(
      parse('13-01-2021', 'dd-MM-yyyy', new Date()),
      parse('13-05-2021', 'dd-MM-yyyy', new Date()),
    );

    expect(groupBy).toEqual('day');
  });

  test('it groups by day for more than 3 days', async () => {
    const groupBy = dialogueStatisticsService.getGroupbyFromDates(
      parse('13-01-2021', 'dd-MM-yyyy', new Date()),
      parse('17-01-2021', 'dd-MM-yyyy', new Date()),
    );

    expect(groupBy).toEqual('day');
  });

  test('it groups by hour for less than 3 days', async () => {
    const groupBy = dialogueStatisticsService.getGroupbyFromDates(
      parse('13-01-2021', 'dd-MM-yyyy', new Date()),
      parse('15-01-2021', 'dd-MM-yyyy', new Date()),
    );

    expect(groupBy).toEqual('hour');
  });
});

describe('DialogueStatisticsService.parseCacheKey', () => {
  afterEach(async () => {
    await clearDialogueDatabase(prisma);
    await prisma.$disconnect();
  });

  test('it returns a base cache key without any date', async () => {
    const cacheKey = dialogueStatisticsService.parseCacheKey('TEST_123')

    expect(cacheKey).toEqual('dialogue_statistics:TEST_123');
  });

  test('it returns a cache key with startDate', async () => {
    const cacheKey = dialogueStatisticsService.parseCacheKey(
      'TEST_123',
      parse('13-01-2021', 'dd-MM-yyyy', new Date()),
    )

    expect(cacheKey).toEqual('dialogue_statistics:TEST_123:00-13-01-2021');
  });

  test('it returns a cache key with startDate and endDate', async () => {
    const cacheKey = dialogueStatisticsService.parseCacheKey(
      'TEST_123',
      parse('13-01-2021', 'dd-MM-yyyy', new Date()),
      parse('15-01-2021', 'dd-MM-yyyy', new Date()),
    )

    expect(cacheKey).toEqual('dialogue_statistics:TEST_123:00-13-01-202100-15-01-2021');
  });
});

describe('DialogueStatisticsService.calculateStatistics', () => {
  afterEach(async () => {
    await clearDialogueDatabase(prisma);
    await prisma.$disconnect();
  });

  test('it can calculate a summary of critical path', async () => {
    // Prep make some interactions and a dialogue
    const createdDialogue = await createTestDialogue(prisma);
    await createFewInteractions(prisma);

    const statisticsSummary = await dialogueStatisticsService.getDialogueStatisticsSummary(
      'TEST_ID'
    );

    expect(statisticsSummary.pathsSummary.mostCriticalPath.nodes).toHaveLength(3);
    // @ts-ignore
    expect(statisticsSummary.pathsSummary.mostCriticalPath.nodes[0].summary.nrEntries).toEqual(3);
    // @ts-ignore
    expect(statisticsSummary.pathsSummary.mostCriticalPath.nodes[1].summary.nrEntries).toEqual(2);
    // @ts-ignore
    expect(statisticsSummary.pathsSummary.mostCriticalPath.nodes[1].summary.visitRate).toBeCloseTo(0.6666666);
    // @ts-ignore
    expect(statisticsSummary.pathsSummary.mostCriticalPath.nodes[2].summary.nrEntries).toEqual(1);
    // @ts-ignore
    expect(statisticsSummary.pathsSummary.mostCriticalPath.nodes[2].summary.visitRate).toBeCloseTo(0.5);

    expect(statisticsSummary.pathsSummary.mostPopularPath.nodes).toHaveLength(3);
    // TODO: Fix this sumamry problem: Prisma backing type ruins this
    // @ts-ignore
    expect(statisticsSummary.pathsSummary.mostPopularPath.nodes[0].summary.nrEntries).toEqual(3);
    // @ts-ignore
    expect(statisticsSummary.pathsSummary.mostPopularPath.nodes[1].summary.nrEntries).toEqual(1);
    // @ts-ignore
    expect(statisticsSummary.pathsSummary.mostPopularPath.nodes[1].summary.visitRate).toBeCloseTo(0.3333333);
    // @ts-ignore
    expect(statisticsSummary.pathsSummary.mostPopularPath.nodes[2].summary.nrEntries).toEqual(1);
    // @ts-ignore
    expect(statisticsSummary.pathsSummary.mostPopularPath.nodes[2].summary.visitRate).toBeCloseTo(1);
  });
});
