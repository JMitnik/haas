import { makeTestContext } from '../../../test/utils/makeTestContext';
import { clearDatabase, seedActionables, seedIssue, seedUser, seedWorkspace } from './testUtils';
import { prisma } from '../../../test/setup/singletonDeps';
import AuthService from '../../auth/AuthService';

jest.setTimeout(30000);

const ctx = makeTestContext(prisma);

const Mutation = `
mutation AssignUserToActionRequest($input: AssignUserToActionRequestInput!) {
	assignUserToActionRequest(input: $input) {
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

describe('AssignUserToActionRequest Resolver', () => {
  afterEach(async () => {
    await clearDatabase(prisma);
    await prisma.$disconnect();
  });

  it('Can (un)assign user to action request', async () => {
    const { workspace, dialogue } = await seedWorkspace(prisma);
    const issue = await seedIssue(prisma, workspace.id);
    await seedActionables(prisma, issue.id, dialogue.id, 10);

    const actionRequest = await prisma.actionRequest.create({
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
          actionRequestId: actionRequest.id,
          assigneeId: user.id,
        },
      },
      {
        'Authorization': `Bearer ${token}`,
      }
    );

    const actionRequestWithAssignee = await prisma.actionRequest.findUnique({
      where: {
        id: actionRequest.id,
      },
    });

    expect(actionRequestWithAssignee?.assigneeId).toBe(user.id);

    await ctx.client.request(Mutation,
      {
        input: {
          workspaceId: workspace.id,
          actionRequestId: actionRequest.id,
          assigneeId: null,
        },
      },
      {
        'Authorization': `Bearer ${token}`,
      }
    );

    const actionableWithoutAssignee = await prisma.actionRequest.findUnique({
      where: {
        id: actionRequest.id,
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
            actionRequestId: 'actionRequest.id',
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
