import { makeTestPrisma } from '../../../test/utils/makeTestPrisma';
import { makeTestContext } from '../../../test/utils/makeTestContext';
import { clearDatabase, prepDefaultCreateData, prepDefaultUpdateData } from './testUtils';
import AuthService from '../../auth/AuthService';
import { constructValidUpdateAutomationInputData } from './testData';

jest.setTimeout(30000);

const prisma = makeTestPrisma();
const ctx = makeTestContext(prisma);

interface EnableAutomationInput {
  workspaceId: string;
  automationId: string;
  state: boolean;
}

afterEach(async () => {
  await clearDatabase(prisma);
  await prisma.$disconnect();
});

it('Enables/Disables automation', async () => {
  const { user, workspace, dialogue, question, userRole } = await prepDefaultCreateData(prisma);
  const { automation } = await prepDefaultUpdateData(prisma, userRole.id, workspace.id, dialogue.id, question.id);

  expect(automation?.isActive).toBe(true);
  await prisma.role.update({
    where: { id: userRole.id },
    data: {
      permissions: ['CAN_UPDATE_AUTOMATIONS'],
    },
  })

  // Generate token for API access
  const token = AuthService.createUserToken(user.id, 22);

  const input: EnableAutomationInput = {
    automationId: automation.id,
    workspaceId: workspace.id,
    state: false,
  }
  // const input = constructValidUpdateAutomationInputData(workspace, dialogue, question, automation);
  const resStateFalse = await ctx.client.request(`
    mutation enableAutomation($input: EnableAutomationInput) {
      enableAutomation(input: $input) {
        id
        isActive
      }
    }
  `,
    {
      input: input,
    },
    {
      'Authorization': `Bearer ${token}`,
    }
  ).then((data) => data?.enableAutomation);

  expect(resStateFalse).toMatchObject({
    isActive: false,
  });

  const automationEnabledInput: EnableAutomationInput = {
    automationId: automation.id,
    workspaceId: workspace.id,
    state: true,
  }

  const resStateTrue = await ctx.client.request(`
  mutation enableAutomation($input: EnableAutomationInput) {
    enableAutomation(input: $input) {
      id
      isActive
    }
  }
`,
    {
      input: automationEnabledInput,
    },
    {
      'Authorization': `Bearer ${token}`,
    }
  ).then((data) => data?.enableAutomation);

  expect(resStateTrue).toMatchObject({
    isActive: true,
  });

});

it('unable to enable/disable automations unauthorized', async () => {
  const { user, workspace, userRole, dialogue, question } = await prepDefaultCreateData(prisma);
  const { automation } = await prepDefaultUpdateData(prisma, userRole.id, workspace.id, dialogue.id, question.id);

  // No 'CAN_UPDATE_AUTOMATIONS' permission
  await prisma.role.update({
    where: { id: userRole.id },
    data: {
      permissions: ['CAN_CREATE_AUTOMATIONS', 'CAN_VIEW_AUTOMATIONS'],
    },
  })

  // Generate token for API access
  const token = AuthService.createUserToken(user.id, 22);
  const input: EnableAutomationInput = {
    automationId: automation.id,
    workspaceId: workspace.id,
    state: true,
  }

  try {
    await ctx.client.request(`
      mutation enableAutomation($input: EnableAutomationInput) {
        enableAutomation(input: $input) {
          id
          isActive
        }
      }
    `,
      {
        input: input,
      },
      {
        'Authorization': `Bearer ${token}`,
      }
    );
  } catch (error) {
    if (error instanceof Error) {
      expect(error.message).toContain('Not Authorised!');
    } else { throw new Error(); }
  }
});



