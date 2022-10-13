import { makeTestContext } from '../../../test/utils/makeTestContext';
import AuthService from '../../auth/AuthService';
import { prisma } from '../../../test/setup/singletonDeps';
import { makeAdminUser } from '../../../test/utils/makeAdminUser';
import { clearDatabase } from '../../../test/utils/clearDatabase';
import { makeTestWorkspace } from '../../../test/utils/makeTestWorkspace';
import { DialogueScheduleService } from '../../DialogueSchedule/DialogueScheduleService';
import { seedDialogue } from './testUtils';
import { DialogueWhereUniqueInput } from '../Dialogue.types';

const ctx = makeTestContext(prisma);

const Query = `
  query GetDialogue($input: DialogueWhereUniqueInput!) {
    dialogue(where: $input) {
      id
      isOnline
    }
  }
`;

const query = (input: DialogueWhereUniqueInput, token: string) => (
  ctx.client.request(Query,
    { input },
    { 'Authorization': `Bearer ${token}` },
  )
);

describe('Dialogue.graphql', () => {
  beforeEach(async () => {
    await clearDatabase(prisma);
  });

  test('dialogue can be fetched', async () => {
    const user = await makeAdminUser(prisma);
    const token = AuthService.createUserToken(user.id, 22);
    const workspaceId = (await makeTestWorkspace(prisma)).customerId;
    const dialogue = (await seedDialogue(prisma, workspaceId, 'test', false, 'Test dialogue'));

    const res = await query({
      id: dialogue.id,
      slug: dialogue.slug,
    }, token);

    expect(res).toMatchObject({
      dialogue: {
        id: dialogue.id,
        isOnline: true,
      },
    });
  });

  test('dialogue with schedule (and active) returns online true', async () => {
    // We mock the current date (2022-10-13 15:00 is on a Thursday)
    // Note that 9th month in Date.UTC translates to 10th month in date
    const dateNowSpy = jest.spyOn(Date, 'now').mockImplementation(() => Date.UTC(2022, 9, 13, 15));

    const user = await makeAdminUser(prisma);
    const token = AuthService.createUserToken(user.id, 22);
    const workspaceId = (await makeTestWorkspace(prisma)).customerId;
    const dialogue = (await seedDialogue(prisma, workspaceId, 'test', false, 'Test dialogue'));

    const dialogueScheduleService = new DialogueScheduleService(prisma);
    await dialogueScheduleService.save({
      workspaceId,
      dataPeriod: {
        startDateExpression: '00 12 01 * 01', // Monday midday
        endInDeltaMinutes: 60 * 24 * 7, // One week
      },
      evaluationPeriod: {
        startDateExpression: '00 12 01 * 04', // Thursday midday
        endInDeltaMinutes: 60 * 4 * 24, // 24 hours
      },
    });

    const res = await query({
      id: dialogue.id,
      slug: dialogue.slug,
    }, token);

    expect(res).toMatchObject({
      dialogue: {
        id: dialogue.id,
        isOnline: true,
      },
    });

    dateNowSpy.mockRestore();
  });

  test('dialogue with schedule (and active) returns online false', async () => {
    // We mock the current date (2022-10-11 15:00 is on a Tuesday
    // Note that 9th month in Date.UTC translates to 10th month in date
    const dateNowSpy = jest.spyOn(Date, 'now').mockImplementation(() => Date.UTC(2022, 9, 11, 15));

    const user = await makeAdminUser(prisma);
    const token = AuthService.createUserToken(user.id, 22);
    const workspaceId = (await makeTestWorkspace(prisma)).customerId;
    const dialogue = (await seedDialogue(prisma, workspaceId, 'test', false, 'Test dialogue'));

    const dialogueScheduleService = new DialogueScheduleService(prisma);
    await dialogueScheduleService.save({
      workspaceId,
      dataPeriod: {
        startDateExpression: '00 12 01 * 01', // Monday midday
        endInDeltaMinutes: 60 * 24 * 7, // One week
      },
      evaluationPeriod: {
        startDateExpression: '00 12 01 * 04', // Thursday midday
        endInDeltaMinutes: 60 * 4 * 24, // 24 hours
      },
    });

    const res = await query({
      id: dialogue.id,
      slug: dialogue.slug,
    }, token);

    expect(res).toMatchObject({
      dialogue: {
        id: dialogue.id,
        isOnline: false,
      },
    });

    dateNowSpy.mockRestore();
  });
})
