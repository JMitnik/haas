import { makeTestPrisma } from '../../../test/utils/makeTestPrisma';
import { makeTestContext } from '../../../test/utils/makeTestContext';
import { clearDatabase, prepDefaultCreateData } from './testUtils';
import AuthService from '../../auth/AuthService';
import { constructValidCreateAutomationInputData } from './testData';

jest.setTimeout(30000);

const prisma = makeTestPrisma();
const ctx = makeTestContext(prisma);

afterEach(async () => {
  await clearDatabase(prisma);
  await prisma.$disconnect();
});

it('creates automation', async () => {
  const { user, workspace, dialogue, question } = await prepDefaultCreateData(prisma);

  // Generate token for API access
  const token = AuthService.createUserToken(user.id, 22);
  const input = constructValidCreateAutomationInputData(workspace, dialogue, question);
  const res = await ctx.client.request(`
    mutation createAutomation($input: CreateAutomationInput) {
      createAutomation(input: $input) {
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
    'Authorization': `Bearer ${token}`,
  }
  ).then((data) => data?.createAutomation);

  expect(res).toMatchObject({
    type: input.automationType,
    label: input.label,
  });
})

it('unable to create automation when no workspace id is provided', async () => {
  const { user, workspace, dialogue, question } = await prepDefaultCreateData(prisma);

  // Generate token for API access
  const token = AuthService.createUserToken(user.id, 22);
  const input = constructValidCreateAutomationInputData(workspace, dialogue, question);
  input.workspaceId = null;

  try {
    await ctx.client.request(`
      mutation createAutomation($input: CreateAutomationInput) {
        createAutomation(input: $input) {
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
      'Authorization': `Bearer ${token}`,
    }
    );
  } catch (error) {
    if (error instanceof Error) {
      expect(error.message).toContain('Not Authorised!');
    } else { throw new Error(); }
  }
});

it('unable to create automation when no automation label is provided', async () => {
  const { user, workspace, dialogue, question } = await prepDefaultCreateData(prisma);

  // Generate token for API access
  const token = AuthService.createUserToken(user.id, 22);
  const input = constructValidCreateAutomationInputData(workspace, dialogue, question);
  input.label = null;

  try {
    await ctx.client.request(`
      mutation createAutomation($input: CreateAutomationInput) {
        createAutomation(input: $input) {
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
      'Authorization': `Bearer ${token}`,
    }
    );
  } catch (error) {
    if (error instanceof Error) {
      expect(error.message).toContain('No label provided');
    } else { throw new Error(); }
  }
});

it('unable to create automation when no automation type is provided', async () => {
  const { user, workspace, dialogue, question } = await prepDefaultCreateData(prisma);

  // Generate token for API access
  const token = AuthService.createUserToken(user.id, 22);
  const input = constructValidCreateAutomationInputData(workspace, dialogue, question);
  input.automationType = null;

  try {
    await ctx.client.request(`
      mutation createAutomation($input: CreateAutomationInput) {
        createAutomation(input: $input) {
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
      'Authorization': `Bearer ${token}`,
    }
    );
  } catch (error) {
    if (error instanceof Error) {
      expect(error.message).toContain('No automation type');
    } else { throw new Error(); }
  }
});

it('unable to create automation when no actions are provided', async () => {
  const { user, workspace, dialogue, question } = await prepDefaultCreateData(prisma);

  // Generate token for API access
  const token = AuthService.createUserToken(user.id, 22);
  const input = constructValidCreateAutomationInputData(workspace, dialogue, question);
  input.actions = [];

  try {
    await ctx.client.request(`
      mutation createAutomation($input: CreateAutomationInput) {
        createAutomation(input: $input) {
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
      'Authorization': `Bearer ${token}`,
    }
    );
  } catch (error) {
    if (error instanceof Error) {
      expect(error.message).toContain('No actions provided');
    } else { throw new Error(); }
  }
});

it('unable to create automation when no action type is provided for an action', async () => {
  const { user, workspace, dialogue, question } = await prepDefaultCreateData(prisma);

  // Generate token for API access
  const token = AuthService.createUserToken(user.id, 22);
  const input = constructValidCreateAutomationInputData(workspace, dialogue, question);
  (input.actions?.[0] as any).type = null;

  try {
    await ctx.client.request(`
      mutation createAutomation($input: CreateAutomationInput) {
        createAutomation(input: $input) {
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
      'Authorization': `Bearer ${token}`,
    }
    );
  } catch (error) {
    if (error instanceof Error) {
      expect(error.message).toContain('No action type provided');
    } else { throw new Error(); }
  }
});

it('unable to create automation when no event type is provided for a condition', async () => {
  const { user, workspace, dialogue, question } = await prepDefaultCreateData(prisma);

  // Generate token for API access
  const token = AuthService.createUserToken(user.id, 22);
  const input = constructValidCreateAutomationInputData(workspace, dialogue, question);
  (input.event as any).eventType = null;

  try {
    await ctx.client.request(`
      mutation createAutomation($input: CreateAutomationInput) {
        createAutomation(input: $input) {
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
      'Authorization': `Bearer ${token}`,
    }
    );
  } catch (error) {
    if (error instanceof Error) {
      expect(error.message).toContain('No event type provided');
    } else { throw new Error(); }
  }
});

it('unable to create automation when no event type is provided for a condition', async () => {
  const { user, workspace, dialogue, question } = await prepDefaultCreateData(prisma);

  // Generate token for API access
  const token = AuthService.createUserToken(user.id, 22);
  const input = constructValidCreateAutomationInputData(workspace, dialogue, question);
  (input.event as any).eventType = null;

  try {
    await ctx.client.request(`
      mutation createAutomation($input: CreateAutomationInput) {
        createAutomation(input: $input) {
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
      'Authorization': `Bearer ${token}`,
    }
    );
  } catch (error) {
    if (error instanceof Error) {
      expect(error.message).toContain('No event type provided');
    } else { throw new Error(); }
  }
});

it('unable to create automation when no targets are provided for a SEND_SMS action', async () => {
  const { user, workspace, dialogue, question } = await prepDefaultCreateData(prisma);

  // Generate token for API access
  const token = AuthService.createUserToken(user.id, 22);
  const input = constructValidCreateAutomationInputData(workspace, dialogue, question);
  const payload = input?.actions?.find((action) => action.type === 'SEND_SMS')?.payload as { targets: Array<string> };
  payload.targets = [];

  try {
    await ctx.client.request(`
      mutation createAutomation($input: CreateAutomationInput) {
        createAutomation(input: $input) {
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
      'Authorization': `Bearer ${token}`,
    }
    );
  } catch (error) {
    if (error instanceof Error) {
      expect(error.message).toContain('No target phone numbers provided');
    } else { throw new Error(); }
  }
});

it('unable to create automations unauthorized', async () => {
  const { user, workspace, userRole, dialogue, question } = await prepDefaultCreateData(prisma);

  await prisma.role.update({
    where: { id: userRole.id },
    data: {
      permissions: [],
    },
  })

  // Generate token for API access
  const token = AuthService.createUserToken(user.id, 22);
  const input = constructValidCreateAutomationInputData(workspace, dialogue, question);

  try {
    await ctx.client.request(`
      mutation createAutomation($input: CreateAutomationInput) {
        createAutomation(input: $input) {
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
      'Authorization': `Bearer ${token}`,
    }
    );
  } catch (error) {
    if (error instanceof Error) {
      expect(error.message).toContain('Not Authorised!');
    } else { throw new Error(); }
  }
});



