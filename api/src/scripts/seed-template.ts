import { PrismaClient } from '@prisma/client';
import cuid from 'cuid';
import * as yargs from 'yargs';

import { CustomerPrismaAdapter } from '../models/customer/CustomerPrismaAdapter';
import UserService from '../models/users/UserService';
import GenerateWorkspaceService from '../models/generate-workspace/GenerateWorkspaceService';
import { DialogueTemplateType } from '../models/QuestionNode/NodeServiceType';

const prisma = new PrismaClient();

const generateWorkspaceService = new GenerateWorkspaceService(prisma);
const customerPrismaAdapter = new CustomerPrismaAdapter(prisma);
const userService = new UserService(prisma);

const argv = yargs
  .option('email', {
    alias: 'e',
    description: 'The email address you want to attach to the workspace',
    type: 'string',
    demandOption: true,
  })
  .option('templateType', {
    alias: 't',
    description: 'Which template do you want to use?',
    choices: [
      DialogueTemplateType.BUSINESS_ENG,
      DialogueTemplateType.BUSINESS_NL,
      DialogueTemplateType.DEFAULT,
      DialogueTemplateType.SPORT_ENG,
      DialogueTemplateType.SPORT_NL,
    ],
    type: 'string',
    default: DialogueTemplateType.SPORT_ENG,
  })
  .option('generateData', {
    alias: 'g',
    description: 'Whether you want to generate data or start with 0 data entries',
    type: 'boolean',
    default: true,
  })
  .option('sessions', {
    alias: 's',
    description: 'The amount of session you want to generate PER dialogue PER day for a month',
    type: 'number',
    default: 1,
  })
  .help()
  .alias('help', 'h').argv;

export const seedBusinessTemplate = async () => {
  console.log(argv);
  const amtSessions = argv.sessions;
  const ownEmail = argv.email;
  const templateType = argv.templateType;
  const generateData = argv.generateData;

  let user = await userService.upsertUserByEmail({
    email: ownEmail,
  });

  if (!user) {
    user = await userService.upsertUserByEmail({
      email: ownEmail,
    });
  }

  const template = generateWorkspaceService.getTemplate(templateType);
  const workspace = await customerPrismaAdapter.createWorkspace({
    name: `${templateType} Workspace`,
    primaryColour: '',
    logo: '',
    slug: `${templateType.toLowerCase()}-${cuid.slug()}`,
  }, template);

  return generateWorkspaceService.generateDemoData(templateType, workspace, user.id, amtSessions, generateData);
};

seedBusinessTemplate().then(() => { })
  .catch(async (err) => {
    console.log(err);
    await prisma.$disconnect()
    process.exit(0);
  })
  .finally(() => prisma.$disconnect());
