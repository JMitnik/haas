import { makeTestContext } from '../../../test/utils/makeTestContext';
import AuthService from '../../auth/AuthService';
import { prisma } from '../../../test/setup/singletonDeps';
import { makeAdminUser } from '../../../test/utils/makeAdminUser';
import { clearDatabase } from '../../../test/utils/clearDatabase';
import { makeTestWorkspace } from '../../../test/utils/makeTestWorkspace';
import { DialogueScheduleService } from '../../DialogueSchedule/DialogueScheduleService';

const ctx = makeTestContext(prisma);

const Query = `
  query GetWorkspace($id: ID!) {
    customer(id: $id) {
      id
      dialogueSchedule {
        id
        dataPeriodSchedule {
          id
          startDateExpression
          endInDeltaMinutes
        }
        evaluationPeriodSchedule {
          id
          startDateExpression
          endInDeltaMinutes
        }
      }
    }
  }
`;

const query = (id: string, token: string) => (
  ctx.client.request(Query,
    { id },
    { 'Authorization': `Bearer ${token}` },
  )
);

describe('Customer.graphql', () => {
  beforeEach(async () => {
    await clearDatabase(prisma);
  });

  test('workspace can be fetched', async () => {
    const user = await makeAdminUser(prisma);
    const token = AuthService.createUserToken(user.id, 22);
    const workspaceId = (await makeTestWorkspace(prisma)).customerId;

    const res = await query(workspaceId, token);

    expect(res).toMatchObject({
      customer: {
        id: workspaceId,
        dialogueSchedule: null,
      },
    });
  });

  test('workspace can be fetched with dialogue schedule', async () => {
    const user = await makeAdminUser(prisma);
    const token = AuthService.createUserToken(user.id, 22);
    const workspaceId = (await makeTestWorkspace(prisma)).customerId;

    const dialogueScheduleService = new DialogueScheduleService(prisma);
    const { dialogueSchedule } = await dialogueScheduleService.create({
      workspaceId,
      dataPeriod: {
        startDateExpression: '00 12 01 * 01', // Monday midday
        endInDeltaMinutes: 60 * 24 * 7, // One week
      },
      evaluationPeriod: {
        startDateExpression: '00 12 01 * 01', // Monday midday
        endInDeltaMinutes: 60 * 4, // 4 hours
      },
    });

    const res = await query(workspaceId, token);

    expect(res).toMatchObject({
      customer: {
        id: workspaceId,
        dialogueSchedule: {
          id: dialogueSchedule?.id,
          dataPeriodSchedule: {
            id: dialogueSchedule!.dataPeriodSchedule!.id,
            startDateExpression: '00 12 01 * 01', // Monday midday
            endInDeltaMinutes: 60 * 24 * 7, // One week
          },
          evaluationPeriodSchedule: {
            id: dialogueSchedule!.evaluationPeriodSchedule!.id,
            startDateExpression: '00 12 01 * 01', // Monday midday
            endInDeltaMinutes: 60 * 4, // 4 hours
          },
        },
      },
    });
  });
})
