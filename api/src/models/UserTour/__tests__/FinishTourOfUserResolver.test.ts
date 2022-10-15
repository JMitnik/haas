import { clearDatabase, prepDefaultCreateData } from './testUtils';
import { makeTestContext } from '../../../test/utils/makeTestContext';
import { expectUnauthorizedErrorOnResolver } from '../../../test/utils/expects';
import AuthService from '../../auth/AuthService';
import { ApolloError } from 'apollo-server-express';
import { prisma } from '../../../test/setup/singletonDeps';


jest.setTimeout(30000);

const ctx = makeTestContext(prisma);

const CreateMutation = `
  mutation CreateAndDispatchUserTour ($input: CreateUserTourInput!) {
    createAndDispatchUserTour(input: $input) {
      id
    }
  }
`;

const FinishMutation = `
  mutation FinishTourOfUser($input: FinishTourOfUserInput!) {
    finishTourOfUser(input: $input) {
      tour {
        id
        triggerVersion
        triggerPage
      }
      seenAt
    }
  }
`

describe('CreateUserTourResolver', () => {
  afterEach(async () => {
    await clearDatabase(prisma);
    await prisma.$disconnect();
  });

  afterAll(async () => {
    await clearDatabase(prisma);
    await prisma.$disconnect();
  });

  test('Can set a UserTour as "seen" for a user', async () => {
    const { user } = await prepDefaultCreateData(prisma, ['CAN_ACCESS_ADMIN_PANEL']);

    const newUser = await prisma.user.create({
      data: {
        email: 'new_user@haas.live',
      },
    });

    const token = AuthService.createUserToken(user.id, 22);

    const createRes = await ctx.client.request(CreateMutation, {
      input: {
        'type': 'RELEASE',
        'triggerVersion': '1.3',
        'steps': [
          {
            'titleKey': 'new_feature_worst_step_1',
            'helperKey': 'new_feature_worst_step_2',
          },
          {
            'titleKey': 'new_feature_worst_step_3',
            'helperKey': 'new_feature_worst_step_4',
          },
        ],
      },
    }, { 'Authorization': `Bearer ${token}` });

    const userTourId = createRes?.createAndDispatchUserTour?.id;

    // No need for user to be super admin. Should be able to finish its own tours
    await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        globalPermissions: [],
      },
    });

    const finishRes = await ctx.client.request(FinishMutation, {
      input: {
        'userTourId': userTourId,
        userId: user.id,
      },
    }, { 'Authorization': `Bearer ${token}` });

    // Expect seenAt for this TourOfUser to have a date 
    expect(finishRes?.finishTourOfUser?.seenAt).not.toBeNull();

    const tourOfUser = await prisma.tourOfUser.findUnique({
      where: {
        userId_userTourId: {
          userId: user.id,
          userTourId,
        },
      },
    });

    expect(tourOfUser?.seenAt).not.toBeNull();

    // Expect the tour as unseen for the other user
    const unseenTourOfUser = await prisma.tourOfUser.findUnique({
      where: {
        userId_userTourId: {
          userId: newUser.id,
          userTourId,
        },
      },
    });

    expect(unseenTourOfUser?.seenAt).toBeNull();
  });

});
