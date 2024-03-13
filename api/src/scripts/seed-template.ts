import { DialogueTemplateType, PrismaClient, Role, RoleTypeEnum } from 'prisma/prisma-client';
import cuid from 'cuid';
import * as yargs from 'yargs';

import { CustomerPrismaAdapter } from '../models/customer/CustomerPrismaAdapter';
import UserService from '../models/users/UserService';
import GenerateWorkspaceService from '../models/generate-workspace/GenerateWorkspaceService';
import { getTemplate } from '../models/generate-workspace/GenerateWorkspaceService.helpers';
import UserOfCustomerPrismaAdapter from '../models/users/UserOfCustomerPrismaAdapter';

const prisma = new PrismaClient();

const generateWorkspaceService = new GenerateWorkspaceService(prisma);
const customerPrismaAdapter = new CustomerPrismaAdapter(prisma);
const userService = new UserService(prisma);
const userOfCustomerPrismaAdapter = new UserOfCustomerPrismaAdapter(prisma);

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
      DialogueTemplateType.STUDENT_NL,
      DialogueTemplateType.TEACHER_NL,
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
  .option('range', {
    alias: 'r',
    array: true,
    type: 'array',
    default: [70, 80],
    description: 'The range of scores for the generated sessions',
  })
  .help()
  .alias('help', 'h').argv as any;

// const addUser = async (workspaceWithRoles: Workspace, type: RoleTypeEnum) => {
//   const role = workspaceWithRoles.roles.find((role) => role.type === type);
//   const user = await userService.upsertUserByEmail({
//     email: `${workspaceWithRoles.slug}-${type.toLowerCase()}`,
//     firstName: type,
//     lastName: 'User',
//   });

//   await userOfCustomerPrismaAdapter.connectUserToWorkspace(
//     workspaceWithRoles.id,
//     role?.id as string,
//     user.id as string
//   );
// }

export const seedBusinessTemplate = async () => {
  const amtSessions = argv.sessions;
  const ownEmail = argv.email;
  const templateType = argv.templateType;
  const generateData = argv.generateData;
  let scoreRange = argv.range;

  if (scoreRange.length <= 1) scoreRange = [70, 80]

  let user = await userService.upsertUserByEmail({
    email: ownEmail,
  });

  if (!user) {
    user = await userService.upsertUserByEmail({
      email: ownEmail,
    });
  }

  const template = getTemplate(templateType);
  const workspace = await customerPrismaAdapter.createWorkspace({
    name: `${templateType} Workspace`,
    primaryColour: '',
    logo: '',
    slug: `${templateType.toLowerCase()}-${cuid.slug()}`,
  }, template);

  const managerUser = await userService.upsertUserByEmail({
    email: `manager@${workspace.slug}.com`,
    firstName: 'Manager',
    lastName: 'Boy',
  })

  const adminRole = workspace.roles.find((role) => role.type === RoleTypeEnum.ADMIN) as Role;
  const managerRole = workspace.roles.find((role) => role.type === RoleTypeEnum.ADMIN) as Role;

  await userOfCustomerPrismaAdapter.connectUserToWorkspace(
    workspace.id,
    adminRole?.id as string,
    user.id,
  );

  await userOfCustomerPrismaAdapter.connectUserToWorkspace(
    workspace.id,
    managerRole?.id as string,
    managerUser.id,
  );

  return generateWorkspaceService.generateDialoguesByTemplateLayers(
    workspace, templateType, amtSessions, generateData, false, scoreRange[0], scoreRange[1]
  );
};

seedBusinessTemplate().then(() => { })
  .catch(async (err) => {
    console.log(err);
    await prisma.$disconnect()
    process.exit(0);
  })
  .finally(() => prisma.$disconnect());
