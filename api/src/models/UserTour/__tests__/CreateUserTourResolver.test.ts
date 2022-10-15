import { clearDatabase, prepDefaultCreateData } from './testUtils';
import { makeTestContext } from '../../../test/utils/makeTestContext';
import { expectUnauthorizedErrorOnResolver } from '../../../test/utils/expects';
import AuthService from '../../auth/AuthService';
import { ApolloError } from 'apollo-server-express';
import { prisma } from '../../../test/setup/singletonDeps';


jest.setTimeout(30000);

const ctx = makeTestContext(prisma);

const Mutation = `
  mutation CreateAndDispatchUserTour ($input: CreateUserTourInput!) {
    createAndDispatchUserTour(input: $input) {
      id
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

  test('Can Create User Tour and dispatch it to existing users', async () => {
    const { user } = await prepDefaultCreateData(prisma, ['CAN_ACCESS_ADMIN_PANEL']);

    await prisma.user.create({
      data: {
        email: 'new_user@haas.live',
      },
    });

    const token = AuthService.createUserToken(user.id, 22);

    let res = await ctx.client.request(Mutation, {
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

    const userTour = await prisma.userTour.findFirst({
      where: {
        type: 'RELEASE',
        triggerVersion: '1.3',
      },
      include: {
        steps: true,
        usersOfTour: true,
      },
    });

    expect(userTour).not.toBeNull();
    // Should be dispatched to all users
    expect(userTour?.usersOfTour).toHaveLength(2);

    // Should have two steps
    expect(userTour?.steps).toHaveLength(2);
  });

  test('Cannot create and dispatch tour if not super admin', async () => {
    const { user } = await prepDefaultCreateData(prisma, []);

    const token = AuthService.createUserToken(user.id, 22);

    try {
      await ctx.client.request(Mutation, {
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
    } catch (error) {
      if (error instanceof Error) {
        expect(error.message).toContain('Not Authorised!');
      } else { throw new Error(); }
    }

  });

});
