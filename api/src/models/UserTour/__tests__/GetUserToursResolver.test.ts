import { clearDatabase, prepDefaultCreateData, prepTours } from './testUtils';
import { makeTestContext } from '../../../test/utils/makeTestContext';
import AuthService from '../../auth/AuthService';
import { prisma } from '../../../test/setup/singletonDeps';
import { UserTourService } from '../UserTourService';


jest.setTimeout(30000);

const ctx = makeTestContext(prisma);

const userTourService = new UserTourService(prisma);

const Query = `
  query GetUserTours($userId: String!) {
    user(userId: $userId) {
      tours {
        featureTours {
          id
          type
          triggerPage
          triggerVersion
          steps {
            titleKey
            helperKey
            imageUrlKey
          }
        }
        releaseTour {
          id
          type
          triggerPage
          triggerVersion
          usersOfTour {
            seenAt
          }
          steps {
            titleKey
            helperKey
            imageUrlKey
          }
        }
      }
    }
  }
`

describe('GetUserToursResolver', () => {
  afterEach(async () => {
    await clearDatabase(prisma);
    await prisma.$disconnect();
  });

  afterAll(async () => {
    await clearDatabase(prisma);
    await prisma.$disconnect();
  });

  test('Can see release and guides', async () => {
    const { user } = await prepDefaultCreateData(prisma, []);

    const token = AuthService.createUserToken(user.id, 22);

    await prepTours(prisma);

    let res = await ctx.client.request(Query, {
      userId: user.id,
    }, { 'Authorization': `Bearer ${token}` });

    expect(res?.user?.tours?.releaseTour).not.toBeNull();
    expect(res?.user?.tours?.featureTours).toHaveLength(2);
  });

  test('Only shows latest release', async () => {
    const { user } = await prepDefaultCreateData(prisma, []);

    const token = AuthService.createUserToken(user.id, 22);

    const tours = await prepTours(prisma);

    let res = await ctx.client.request(Query, {
      userId: user.id,
    }, { 'Authorization': `Bearer ${token}` });

    expect(res?.user?.tours?.releaseTour).not.toBeNull();
    expect(res?.user?.tours?.featureTours).toHaveLength(2);

    // Finishes last release (sets seenAt to non-null)
    await userTourService.finishTourOfUser(tours.latestRelease.id, user.id);

    res = await ctx.client.request(Query, {
      userId: user.id,
    }, { 'Authorization': `Bearer ${token}` });

    // Since last release has been seen no release will be returned by the query 
    // (even though there is an unseen earlier release)
    expect(res?.user?.tours?.releaseTour).toBeNull();
  });

  test('Only shows unseen guides', async () => {
    const { user } = await prepDefaultCreateData(prisma, []);

    const token = AuthService.createUserToken(user.id, 22);

    const tours = await prepTours(prisma);

    let res = await ctx.client.request(Query, {
      userId: user.id,
    }, { 'Authorization': `Bearer ${token}` });

    expect(res?.user?.tours?.featureTours).toHaveLength(2);

    // Finishes guide tour (sets seenAt to non-null)
    await userTourService.finishTourOfUser(tours.automationGuide.id, user.id);

    res = await ctx.client.request(Query, {
      userId: user.id,
    }, { 'Authorization': `Bearer ${token}` });

    // Since guide has been seen only the tour(s) for the other functionality will be returned
    // (even though there is an unseen earlier release)
    expect(res?.user?.tours?.featureTours).toHaveLength(1);
  });

});
