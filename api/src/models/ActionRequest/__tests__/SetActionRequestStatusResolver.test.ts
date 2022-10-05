import { ActionRequestState } from '@prisma/client';

import { makeTestContext } from '../../../test/utils/makeTestContext';
import { clearDatabase, seedIssue, seedUser, seedWorkspace } from './testUtils';
import { prisma } from '../../../test/setup/singletonDeps';
import AuthService from '../../auth/AuthService';

jest.setTimeout(30000);

const ctx = makeTestContext(prisma);

const Mutation = `
mutation SetActionRequestStatus($input: SetActionRequestStatusInput!) {
	setActionRequestStatus(input: $input) {
		id
		status
	}
}
`;

describe('SetactionRequestStatus Resolver', () => {
  afterEach(async () => {
    await clearDatabase(prisma);
    await prisma.$disconnect();
  });

  it('Can set status of actionRequest', async () => {
    const { workspace, dialogue } = await seedWorkspace(prisma);
    const issue = await seedIssue(prisma, workspace.id);

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
    });

    expect(actionRequest.status).toBe(ActionRequestState.PENDING);

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
          status: ActionRequestState.COMPLETED,
        },
      },
      {
        'Authorization': `Bearer ${token}`,
      }
    );

    const actionRequestWithNewStatus = await prisma.actionRequest.findUnique({
      where: {
        id: actionRequest.id,
      },
    });

    expect(actionRequestWithNewStatus?.status).toBe(ActionRequestState.COMPLETED);

  });

  it('Cannot set status without right permission', async () => {
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
            status: ActionRequestState.COMPLETED,
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
