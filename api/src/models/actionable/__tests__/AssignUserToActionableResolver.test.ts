import { makeTestContext } from '../../../test/utils/makeTestContext';
import ActionableService from '../ActionableService';
import { clearDatabase, createSuperAdmin, seedActionables, seedIssue, seedUser, seedWorkspace } from './testUtils';
import { prisma } from '../../../test/setup/singletonDeps';
import AuthService from '../../auth/AuthService';

jest.setTimeout(30000);

const ctx = makeTestContext(prisma);
const actionableService = new ActionableService(prisma);

const Mutation = `
mutation assignUserToActionable($input: AssignUserToActionableInput!) {
	assignUserToActionable (input: $input) {
		createdAt
    session {
      id
      mainScore
    }
    dialogue {
      title
    }
    status
    assignee {
      email
    }
	}
}
`;

describe('AssignUserToActionable Resolver', () => {
  afterEach(async () => {
    await clearDatabase(prisma);
    await prisma.$disconnect();
  });

  it('Can (un)assign user to actionable', async () => {
    const { workspace, dialogue } = await seedWorkspace(prisma);
    const issue = await seedIssue(prisma, workspace.id);
    await seedActionables(prisma, issue.id, dialogue.id, 10);

    const actionable = await prisma.actionable.create({
      data: {
        dialogue: {
          connect: {
            id: dialogue.id,
          },
        },
        issue: {
          connect: {
            id: issue.id,
          },
        },
      },
    })

    const { user } = await seedUser(prisma, workspace.id, {
      name: 'Reader',
      permissions: { set: ['CAN_ACCESS_ALL_ACTION_REQUESTS'] },
    });
    const token = AuthService.createUserToken(user.id, 22);

    await ctx.client.request(Mutation,
      {
        input: {
          workspaceId: workspace.id,
          actionableId: actionable.id,
          assigneeId: user.id,
        },
      },
      {
        'Authorization': `Bearer ${token}`,
      }
    );

    const actionableWithAssignee = await prisma.actionable.findUnique({
      where: {
        id: actionable.id,
      },
    });

    expect(actionableWithAssignee?.assigneeId).toBe(user.id);

    await ctx.client.request(Mutation,
      {
        input: {
          workspaceId: workspace.id,
          actionableId: actionable.id,
          assigneeId: null,
        },
      },
      {
        'Authorization': `Bearer ${token}`,
      }
    );

    const actionableWithoutAssignee = await prisma.actionable.findUnique({
      where: {
        id: actionable.id,
      },
    });

    expect(actionableWithoutAssignee?.assigneeId).toBeNull();


  });

  it('Cannot assign without right permission', async () => {
    const { workspace } = await seedWorkspace(prisma);

    const { user } = await seedUser(prisma, workspace.id, {
      name: 'Reader',
      permissions: { set: [] },
    });
    const token = AuthService.createUserToken(user.id, 22);

    try {
      await ctx.client.request(Mutation,
        {
          input: {
            workspaceId: workspace.id,
            actionableId: 'actionable.id',
            assigneeId: user.id,
          },
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
});
