import { makeTestContext } from '../../../test/utils/makeTestContext';
import { prisma } from '../../../test/setup/singletonDeps';
import { clearDatabase, createSuperAdmin, createUserWithAllRoles, seedActionables, seedIssue, seedWorkspace } from './testUtils';
import { IssueService } from '../IssueService';
import AuthService from 'models/auth/AuthService';

jest.setTimeout(30000);

const ctx = makeTestContext(prisma);
const issueService = new IssueService(prisma);

const Query = `
query GetIssue($input: GetIssueResolverInput, $actionableFilter: ActionableConnectionFilterInput) {
	issue(input: $input) {
		id
		topicId
		topic {
      id
			name
		}
    actionableConnection(input: $actionableFilter) {
      actionables {
        id
        createdAt
        isVerified
        dialogueId
        session {
          id
          mainScore
        }
        dialogue {
          id
          title
          slug
        }
        status
        assignee {
          id
          email
        }
      }
      totalPages
      pageInfo {
        hasNextPage
        hasPrevPage
        nextPageOffset
        pageIndex
        prevPageOffset
      }
    }
	}
}
`;

describe('GetIssue', () => {
  afterEach(async () => {
    await clearDatabase(prisma);
    await prisma.$disconnect();
  });

  it('Can find issue By issue ID', async () => {
    const { workspace, dialogue } = await seedWorkspace(prisma);
    const issue = await seedIssue(prisma, workspace.id);
    await seedActionables(prisma, issue.id, dialogue.id, 10);

    const user = await createSuperAdmin(prisma);

    // Generate token for API access
    const token = AuthService.createUserToken(user.id, 22);

    const res = await ctx.client.request(Query,
      {
        'input': {
          'issueId': issue.id,
        },
        'actionableFilter': {
          'startDate': '12-09-2022 06:50',
          'endDate': '12-09-2022 06:52',
          'status': 'PENDING',
        },
      },
      {
        'Authorization': `Bearer ${token}`,
      }
    );
  });

});
