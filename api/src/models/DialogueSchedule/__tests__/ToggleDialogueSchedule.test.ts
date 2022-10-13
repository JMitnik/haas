import { makeTestContext } from '../../../test/utils/makeTestContext';
import AuthService from '../../auth/AuthService';
import { prisma } from '../../../test/setup/singletonDeps';
import { makeAdminUser } from '../../../test/utils/makeAdminUser';
import { clearDatabase } from '../../../test/utils/clearDatabase';
import { makeTestWorkspace } from '../../../test/utils/makeTestWorkspace';
import { ToggleDialogueScheduleInput } from '../DialogueSchedule.types';
import { DialogueScheduleService } from '../DialogueScheduleService';

const ctx = makeTestContext(prisma);

const Mutation = `
  mutation ToggleDialogueSchedule($input: ToggleDialogueScheduleInput!) {
    toggleDialogueSchedule(input: $input) {
      id
    }
  }
`;

const mutate = (input: ToggleDialogueScheduleInput, token: string) => (
  ctx.client.request(Mutation,
    { input: input },
    { 'Authorization': `Bearer ${token}` },
  )
);

describe('ToggleDialogueSchedule', () => {
  beforeEach(async () => {
    await clearDatabase(prisma);
  });

  test('dialogue schedule can be toggled', async () => {
    const user = await makeAdminUser(prisma);
    const token = AuthService.createUserToken(user.id, 22);
    const workspaceId = (await makeTestWorkspace(prisma)).customerId;
    const dialogueScheduleService = new DialogueScheduleService(prisma);

    const { dialogueSchedule } = await dialogueScheduleService.save({
      workspaceId,
      dataPeriod: {
        startDateExpression: '59 23 * * 1',
        endInDeltaMinutes: 10,
      },
      evaluationPeriod: undefined,
    });

    expect(dialogueSchedule?.isEnabled).toBeTruthy();

    await mutate({
      dialogueScheduleId: dialogueSchedule!.id || '',
      status: false,
    }, token);

    const dialogueScheduleFollowUp = await dialogueScheduleService.findByWorkspaceID(workspaceId);

    expect(dialogueScheduleFollowUp?.fields.isEnabled).toBeFalsy();
  });
})
