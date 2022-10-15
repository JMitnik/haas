import { NodeType, Prisma, PrismaClient } from '@prisma/client';
import { internet } from 'faker';
import AuthService from '../../auth/AuthService';

/**
 * Generates a user with given permissions for a workspace.
 * @param prisma
 * @param workspaceId
 * @param rolePermissions
 * @returns
 */
export const seedUser = async (
  prisma: PrismaClient,
  workspaceId: string,
  role: Prisma.RoleCreateInput,
  userInput?: Prisma.UserCreateInput
) => {
  const user = await prisma.user.create({
    data: {
      email: internet.email(),
      ...userInput,
    },
  });

  const userRole = await prisma.role.create({ data: role });

  const userRoleUser = await prisma.userOfCustomer.create({
    data: {
      customer: { connect: { id: workspaceId } },
      user: { connect: { id: user.id } },
      role: { connect: { id: userRole.id } },
    },
  });

  const token = AuthService.createUserToken(user.id, 22);

  return { user, token, userRole, userRoleUser }
}

export const seedWorkspace = async (prisma: PrismaClient) => {
  const workspace = await prisma.customer.create({
    data: {
      id: 'WORKSPACE_ID',
      name: 'WORKSPACE',
      slug: 'WORKSPACE',
      dialogues: {
        create: {
          id: 'DIALOGUE_ID',
          description: 'desc',
          slug: 'DIALOGUE_SLUG',
          title: 'DIALOGUE',
        },
      },
    },
    include: {
      dialogues: true,
    },
  });

  const topic = await prisma.topic.upsert({
    create: {
      name: 'Home',
    },
    update: {},
    where: {
      name: 'Home',
    },
  });

  const options = [
    {
      value: 'Physical',
    },
    {
      value: 'Home',
      topicId: topic.id,
    },
  ]

  const sliderQuestion = await seedQuestion(prisma, 'DIALOGUE_ID', 'SLIDER', 'SLIDER_ID');
  const choiceQuestion = await seedQuestion(prisma, 'DIALOGUE_ID', 'CHOICE', 'CHOICE_ID', options);
  return { workspace, sliderQuestion, choiceQuestion, dialogue: workspace.dialogues[0] }
}

export const seedQuestion = (
  prisma: PrismaClient,
  dialogueId: string,
  type: NodeType,
  questionId: string,
  options: { value: string; topicId?: string }[] = []
) => {
  return prisma.questionNode.create({
    data: {
      id: questionId,
      title: 'QUESTION',
      type: type,
      options: {
        createMany: {
          data: options,
        },
      },
      questionDialogue: {
        connect: {
          id: dialogueId,
        },
      },
    },
  })
}
