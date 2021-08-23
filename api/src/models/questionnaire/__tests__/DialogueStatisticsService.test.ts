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
