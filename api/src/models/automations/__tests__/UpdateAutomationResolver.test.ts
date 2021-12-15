import { makeTestPrisma } from '../../../test/utils/makeTestPrisma';
import { makeTestContext } from '../../../test/utils/makeTestContext';
import { clearDatabase, prepDefaultCreateData, prepDefaultUpdateData } from './testUtils';
import AuthService from '../../auth/AuthService';
import { constructValidUpdateAutomationInputData } from './testData';

jest.setTimeout(30000);

const prisma = makeTestPrisma();
const ctx = makeTestContext(prisma);

afterEach(async () => {
  await clearDatabase(prisma);
  await prisma.$disconnect();
});

it('updates automation', async () => {
  const { user, workspace, dialogue, question, userRole } = await prepDefaultCreateData(prisma);
  const { automation } = await prepDefaultUpdateData(prisma, userRole.id, workspace.id, dialogue.id, question.id);

  // Generate token for API access
  const token = AuthService.createUserToken(user.id, 22);
  const input = constructValidUpdateAutomationInputData(workspace, dialogue, question, automation);
  const res = await ctx.client.request(`
    mutation updateAutomation($input: CreateAutomationResolverInput) {
      updateAutomation(input: $input) {
        id
        label
        type
      }
    }
  `,
    {
      input: input,
    },
    {
      'Authorization': `Bearer ${token}`
    }
  ).then((data) => data?.updateAutomation);

  expect(res).toMatchObject({
    type: input.automationType,
    label: input.label,
  });
});

it('unable to update automation when no automation id is provided', async () => {
  const { user, workspace, userRole, dialogue, question } = await prepDefaultCreateData(prisma);
  const { automation } = await prepDefaultUpdateData(prisma, userRole.id, workspace.id, dialogue.id, question.id);

  // Generate token for API access
  const token = AuthService.createUserToken(user.id, 22);
  const input = constructValidUpdateAutomationInputData(workspace, dialogue, question, automation);
  input.id = null;

  try {
    await ctx.client.request(`
      mutation updateAutomation($input: CreateAutomationResolverInput) {
        updateAutomation(input: $input) {
          id
          label
          type
        }
      }
    `,
      {
        input: input,
      },
      {
        'Authorization': `Bearer ${token}`
      }
    );
  } catch (error) {
    expect(error.message).toContain('No ID provided for automation');
  }
});

it('unable to create automations unauthorized', async () => {
  const { user, workspace, userRole, dialogue, question } = await prepDefaultCreateData(prisma);
  const { automation } = await prepDefaultUpdateData(prisma, userRole.id, workspace.id, dialogue.id, question.id);

  await prisma.role.update({
    where: { id: userRole.id },
    data: {
      permissions: []
    }
  })

  // Generate token for API access
  const token = AuthService.createUserToken(user.id, 22);
  const input = constructValidUpdateAutomationInputData(workspace, dialogue, question, automation);

  try {
    await ctx.client.request(`
      mutation updateAutomation($input: CreateAutomationResolverInput) {
        updateAutomation(input: $input) {
          id
          label
          type
        }
      }
    `,
      {
        input: input,
      },
      {
        'Authorization': `Bearer ${token}`
      }
    );
  } catch (error) {
    expect(error.message).toContain('Not Authorised!');
  }
});


