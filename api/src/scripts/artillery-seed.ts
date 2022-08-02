import { PrismaClient } from '@prisma/client';
import cuid from 'cuid';
import { company } from 'faker';
import * as yargs from 'yargs';

import CustomerService from '../models/customer/CustomerService';

const prisma = new PrismaClient();

const customerService = new CustomerService(prisma);

const argv = yargs
  .option('email', {
    alias: 'e',
    description: 'The email address you want to attach to the workspaces',
    type: 'string',
    demandOption: true,
  })
  .option('workspaces', {
    alias: 'w',
    description: 'The amount of workspaces you want to generate',
    type: 'number',
    default: 1,
  })
  .option('dialogues', {
    alias: 'd',
    description: 'The amount of dialogues you want to generate PER workspace (Male+Female variant)',
    type: 'number',
    default: 1,
  })
  .option('sessions', {
    alias: 's',
    description: 'The amount of session you want to generate PER dialogue PER day for a month',
    type: 'number',
    default: 5,
  })
  .help()
  .alias('help', 'h').argv as any;

export const generateArtillerySeed = async () => {
  console.log(argv);
  const amtWorkspaces = argv.workspaces;
  const amtDialogues = argv.dialogues;
  const amtSessions = argv.sessions;
  const ownEmail = argv.email;

  const user = await prisma.user.findUnique({
    where: {
      email: ownEmail,
    },
  });

  if (!user) throw new Error('no user found with this email adress. abort.');
  console.log('Started seeding: ', 0, '/', amtWorkspaces);

  let totalDone = 0;

  await Promise.all([...Array(amtWorkspaces)].map(async (value, index) => {
    const workspaceTitle = company.companyName();
    const workspace = await customerService.createWorkspace({
      name: workspaceTitle,
      slug: cuid(),
      primaryColour: '#f47373',
    }, user.id);

    if (!workspace) return;

    await customerService.massSeed({
      customerId: workspace?.id,
      maxGroups: 1,
      maxTeams: Math.ceil(amtDialogues / 2),
      maxSessions: amtSessions,
    }, true);
    totalDone++;

    console.log('Finished seeding: ', totalDone, '/', amtWorkspaces);
  }));

  console.log('Successfully seeded database for performance testing');
};

generateArtillerySeed().then(() => { })
  .catch(async (err) => {
    console.log(err);
    await prisma.$disconnect()
    process.exit(0);
  })
  .finally(() => prisma.$disconnect());
