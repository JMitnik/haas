import { NodeType, Prisma, PrismaClient, SystemPermissionEnum } from '@prisma/client';
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

export const seedIssue = async (prisma: PrismaClient, workspaceId: string) => {
  return prisma.issue.create({
    data: {
      workspace: {
        connect: {
          id: workspaceId,
        },
      },
      topic: {
        connectOrCreate: {
          create: {
            name: 'School',
          },
          where: {
            name: 'School',
          },
        },
      },
    },
  });
};

export const seedActionables = async (
  prisma: PrismaClient,
  issueId: string,
  dialogueId: string,
  count: number = 10
) => {
  await Promise.all(Array(count).map(() => {
    return prisma.actionRequest.create({
      data: {
        dialogue: {
          connect: {
            id: dialogueId,
          },
        },
        issue: {
          connect: {
            id: issueId,
          },
        },
      },
    })
  }));
};

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
  const sliderQuestion = await seedQuestion(prisma, 'DIALOGUE_ID', 'SLIDER', 'SLIDER_ID');
  const choiceQuestion = await seedQuestion(prisma, 'DIALOGUE_ID', 'CHOICE', 'CHOICE_ID');
  return { workspace, sliderQuestion, choiceQuestion, dialogue: workspace.dialogues[0] }
}

export const seedQuestion = (prisma: PrismaClient, dialogueId: string, type: NodeType, questionId: string) => {
  return prisma.questionNode.create({
    data: {
      id: questionId,
      title: 'QUESTION',
      type: type,
      questionDialogue: {
        connect: {
          id: dialogueId,
        },
      },
    },
  })
}

export const createUserWithAllRoles = async (prisma: PrismaClient) => {
  return prisma.userOfCustomer.create({
    data: {
      customer: {
        create: {
          name: 'Customer',
          slug: 'CUSTOMER_SLUG',
        },
      },
      role: {
        create: {
          name: 'ADMIN',
          permissions: [...Object.values(SystemPermissionEnum)],
          type: 'ADMIN',
        },
      },
      user: {
        create: {
          email: 'admin@haas.com',
          firstName: 'haas',
          lastName: 'admin',
        },
      },
    },
    include: {
      user: {
        select: {
          id: true,
        },
      },
    },
  });
}

export const createSuperAdmin = async (prisma: PrismaClient) => {
  return prisma.user.create({
    data: {
      email: 'super@admin.com',
      globalPermissions: ['CAN_ACCESS_ADMIN_PANEL'],
    },
  });
}
