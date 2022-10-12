import { makeTestContext } from '../../../test/utils/makeTestContext';
import AuthService from '../../auth/AuthService';
import { prisma } from '../../../test/setup/singletonDeps';
import { makeAdminUser } from '../../../test/utils/makeAdminUser';
import { clearDatabase } from '../../../test/utils/clearDatabase';
import { makeTestWorkspace } from '../../../test/utils/makeTestWorkspace';
import { CreateDialogueScheduleInput } from '../DialogueSchedule.types';

const ctx = makeTestContext(prisma);

const Mutation = `
  mutation CreateDialogueSchedule($input: CreateDialogueScheduleInput!) {
    createDialogueSchedule(input: $input) {
      dialogueSchedule {
        id
      }
    }
  }
`;

const mutate = (input: CreateDialogueScheduleInput, token: string) => (
  ctx.client.request(Mutation,
    { input: input },
    { 'Authorization': `Bearer ${token}` },
  )
);

describe('CreateDialogueSchedule', () => {
  beforeEach(async () => {
    await clearDatabase(prisma);
  });

  test('dialogue schedule can be created', async () => {
    const user = await makeAdminUser(prisma);
    const token = AuthService.createUserToken(user.id, 22);
    const workspaceId = (await makeTestWorkspace(prisma)).customerId;

    const res = await mutate({
      workspaceId,
      dataPeriod: { startDateExpression: '59 23 * * 1', endInDeltaMinutes: 20 },
      evaluationPeriod: { startDateExpression: '59 23 * * 3', endInDeltaMinutes: 20 },
    }, token);

    const dialogueSchedules = await prisma.dialogueSchedule.findMany({
      include: {
        dataPeriodSchedule: true,
        evaluationPeriodSchedule: true,
      },
    });

    expect(dialogueSchedules.length).toBe(1);
    expect(dialogueSchedules[0].dataPeriodSchedule?.startDateExpression).toBe('59 23 * * 1');

    expect(res).toMatchObject({
      createDialogueSchedule: {
        dialogueSchedule: {
          id: dialogueSchedules[0].id,
        },
      },
    });
  })
})
