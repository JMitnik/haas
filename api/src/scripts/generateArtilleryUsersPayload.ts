import { PrismaClient, Role } from '@prisma/client';
import * as yargs from 'yargs';
import * as papaparse from 'papaparse';
import * as fs from 'fs';
import { sample, uniqBy } from 'lodash';
import { name, random } from 'faker';
import { isPresent } from 'ts-is-present';

import AuthService from '../models/auth/AuthService';
import defaultWorkspaceTemplate from '../models/templates/defaultWorkspaceTemplate';
import cuid from 'cuid';

const prisma = new PrismaClient();

const argv = yargs
  .command('generate', 'Generates users if command is set', {
    generate: {
      alias: 'g',
      description: 'Flag to indicate you want to generate new users',
      type: 'boolean',
      default: false,
    },
  })
  .option('amount', {
    alias: 'a',
    description: 'Tell the amount of users you want to use',
    type: 'number',
    default: 10,
  })
  .help()
  .alias('help', 'h').argv;

export const generateArtilleryUsersPayload = async () => {
  const minutesInAMonth = 43000;

  // Find all active users cus inactive users cannot be used to do things in a workspace
  const users = await prisma.userOfCustomer.findMany({
    where: {
      isActive: true,
    },
  });

  // Find unique users
  const uniqUsers = uniqBy(users, (user) => user.userId);
  const slicedUsers = uniqUsers.slice(0, argv.amount);
  const generatedUsers: {
    email: string;
    refresh: string | null;
    workspace: string;
  }[] = [];
  // Not enough active users found, generate new ones 
  if (slicedUsers.length < argv.amount && argv._.includes('generate')) {
    const amtAdditionalUsers = argv.amount - slicedUsers.length;
    const existingWorkspaceIds = slicedUsers.map((user) => user.customerId).filter(isPresent);

    let workspaceId = sample(existingWorkspaceIds);

    // If no workspaces exist yet, create a new workspace where new users can be added to
    if (!workspaceId) {
      const customer = await prisma.customer.create({
        data: {
          name: `${random.word()}_workspace`,
          slug: random.word(),
          roles: { create: defaultWorkspaceTemplate.roles },
        },
      });

      workspaceId = customer.id;
    }

    const workspace = await prisma.customer.findUnique({
      where: {
        id: workspaceId,
      },
      include: {
        roles: true,
      },
    });

    const adminRole = workspace?.roles.find((role) => role.type === 'ADMIN') as Role;

    console.log(`Going to generate ${amtAdditionalUsers} new users for workspace ${workspace?.name}`);

    await Promise.all([...Array(amtAdditionalUsers)].map(
      async () => {
        const userId = cuid();
        const user = await prisma.userOfCustomer.create({
          data: {
            isActive: true,
            customer: {
              connect: {
                id: workspaceId,
              },
            },
            role: {
              connect: {
                id: adminRole.id,
              },
            },
            user: {
              create: {
                id: userId,
                email: `${name.firstName()}@haas.live`,
                refreshToken: AuthService.createUserToken(userId, minutesInAMonth),
              },
            },
          },
          include: {
            user: {
              select: {
                email: true,
                refreshToken: true,
              },
            },
          },
        });

        generatedUsers.push({ email: user.user.email, refresh: user.user.refreshToken, workspace: user.customerId });
      }
    ));
  }

  // For every active user, update their refresh token as well as a workplace id that can be used for GraphQL queries
  const refreshedUsers = await Promise.all(slicedUsers.map(async (user) => {
    const refreshToken = AuthService.createUserToken(user.userId, minutesInAMonth);
    const updatedUser = await prisma.user.update({
      where: {
        id: user.userId,
      },
      data: {
        refreshToken,
      },
    });
    return { email: updatedUser.email, refresh: updatedUser.refreshToken, workspace: user.customerId };
  }));

  if (refreshedUsers.length === 0) {
    console.log('No users found, abort.');
    process.exit(0);
  }

  const csv = papaparse.unparse([...refreshedUsers, ...generatedUsers]);

  if (!fs.existsSync('./artillery')) fs.mkdirSync('./artillery');

  fs.writeFileSync('artillery/artillery_users.csv', csv);

  console.log('Successfully generated users CSV for artillery');

};

generateArtilleryUsersPayload().then(() => { })
  .catch(async (err) => {
    console.log(err);
    await prisma.$disconnect()
    process.exit(0);
  })
  .finally(() => prisma.$disconnect());
