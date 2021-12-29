import { PrismaClient } from '@prisma/client';

import DialogueService from '../models/questionnaire/DialogueService';
import { defaultAdminRole, defaultBotRole, defaultManagerRole, defaultUserRole } from '../models/templates/defaultWorkspaceTemplate';

const prisma = new PrismaClient();
const dialogueService = new DialogueService(prisma);

/**
 * Check if the tables already exist in the database.
 *
 * Note: checks only workspace table, and assumes that the operation was completely successful.
 */
export const checkSeedApplied = async () => {
  const workspaceExists = await prisma.customer.findFirst({ where: { id: 'WORKSPACE_1' } });

  if (workspaceExists) {
    console.log('Seed already applied.');
    process.exit(0);
  }
};

/**
 * Creates a few default tables in the database.
 */
export const createSeedTables = async () => {
  await prisma.user.create({
    data: {
      id: 'USER_admin_1',
      email: 'admin@haas.live',
      globalPermissions: { set: ['CAN_ACCESS_ADMIN_PANEL']},
      firstName: 'Jojo',
      lastName: 'Rabbit',
    },
  });

  await prisma.user.create({
    data: {
      id: 'BOT_admin_1',
      email: 'bot@haas.live',
      globalPermissions: { set: ['CAN_ACCESS_ADMIN_PANEL']},
      firstName: 'Bot',
      lastName: '',
    },
  });

  const workspace = await prisma.customer.create({
    data: {
      id: 'WORKSPACE_1',
      name: 'Haas',
      slug: 'haas',
      roles: {
        create: [
          defaultAdminRole,
          defaultUserRole,
          defaultBotRole,
          defaultManagerRole,
        ],
      },
      settings: {
        create: {
          colourSettings: {
            create: {
              primary: '#292640',
            },
          },
        },
      },
    },
    include: {
      roles: true,
    },
  });

  const adminRole = workspace.roles.find(role => role.name === 'Admin');
  const botRole = workspace.roles.find(role => role.name === 'Bot');

  if (!adminRole) { throw Error('No admin role found.'); }
  if (!botRole) { throw Error('No bot role found.'); }

  // TODO: Ensure the dialogueservice can also receive an ID
  await dialogueService.createDialogue({
    publicTitle: 'How happy are you?',
    title: 'How happy are you?',
    contentType: 'SEED',
    customerSlug: 'haas',
    description: 'In our haas Workspace, we are all happy',
    dialogueSlug: 'haas-happy',
    language: 'DUTCH',
    tags: { entries: [] },
  });

  await prisma.userOfCustomer.create({
    data: {
      customer: { connect: { id: 'WORKSPACE_1' } },
      role: { connect:{ id: adminRole.id }  },
      user: { connect: { id: 'USER_admin_1' } },
    },
  });

  await prisma.userOfCustomer.create({
    data: {
      customer: { connect: { id: 'WORKSPACE_1' } },
      role: { connect:{ id: botRole.id }  },
      user: { connect: { id: 'BOT_admin_1' } },
    },
  });
};

export const seed = async () => {
  await checkSeedApplied();
  await createSeedTables();
  console.log('Seed applied successfully.');
  process.exit(0);
};

seed().then(() => {}).catch(err => {console.log(err)}).finally(() => {});
