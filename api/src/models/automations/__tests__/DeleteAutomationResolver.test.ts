import { makeTestPrisma } from '../../../test/utils/makeTestPrisma';
import { makeTestContext } from '../../../test/utils/makeTestContext';
import { clearDatabase, prepDefaultCreateData, prepDefaultUpdateData } from './testUtils';
import AuthService from '../../auth/AuthService';
import { constructValidUpdateAutomationInputData } from './testData';

jest.setTimeout(30000);

const prisma = makeTestPrisma();
const ctx = makeTestContext(prisma);

interface DeleteAutomationInput {
  workspaceId: string;
  automationId: string;
}

afterEach(async () => {
  await clearDatabase(prisma);
  await prisma.$disconnect();
});

it('Deletes automation', async () => {
  const { user, workspace, dialogue, question, userRole } = await prepDefaultCreateData(prisma);
  const { automation } = await prepDefaultUpdateData(prisma, userRole.id, workspace.id, dialogue.id, question.id);
  const { automation: automationTwo } = await prepDefaultUpdateData(
    prisma,
    userRole.id,
    workspace.id,
    dialogue.id,
    question.id
  );

  await prisma.role.update({
    where: { id: userRole.id },
    data: {
      permissions: ['CAN_UPDATE_AUTOMATIONS'],
    },
  })

  // Generate token for API access
  const token = AuthService.createUserToken(user.id, 22);

  const automationsBeforeDeletion: { id: string }[] = await ctx.client.request(`
    query customer {
      customer(slug: "${workspace.slug}") {
        automations {
          id
          label
        }
      }
    }
  `,
    undefined,
    {
      'Authorization': `Bearer ${token}`,
    }
  ).then((data) => data?.customer?.automations);

  expect(automationsBeforeDeletion).toContain(automation.id);

  const input: DeleteAutomationInput = {
    automationId: automation.id,
    workspaceId: workspace.id,
  }
  // const input = constructValidUpdateAutomationInputData(workspace, dialogue, question, automation);
  const res = await ctx.client.request(`
    mutation deleteAutomation($input: DeleteAutomationInput) {
      deleteAutomation(input: $input) {
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
  ).then((data) => data?.deleteAutomation);

  expect(res).toMatchObject({
    id: automation.id,
  });

  const automations: { id: string }[] = await ctx.client.request(`
    query customer {
      customer(slug: "${workspace.slug}") {
        automations {
          id
          label
        }
      }
    }
  `,
    undefined,
    {
      'Authorization': `Bearer ${token}`,
    }
  ).then((data) => data?.customer?.automations);

  const existingAutomationIds: string[] = automations.map((automation) => automation.id);
  expect(existingAutomationIds).not.toContain(automation.id);
  expect(existingAutomationIds).toContain(automationTwo.id);

});

it('unable to delete automations unauthorized', async () => {
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
  const input: DeleteAutomationInput = {
    automationId: automation.id,
    workspaceId: workspace.id,
  }

  try {
    await ctx.client.request(`
      mutation deleteAutomation($input: DeleteAutomationInput) {
        deleteAutomation(input: $input) {
          id
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



