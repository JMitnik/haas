import { NodeType, Prisma, PrismaClient } from "@prisma/client";
import { internet, date } from "faker";
import AuthService from "../../models/auth/AuthService";

/**
 * Generates a workspace in a database.
 * @param prisma
 * @returns
 */
export const seedWorkspace = async (prisma: PrismaClient) => {
  const workspace = await prisma.customer.create({
    data: {
      name: 'Test workspace',
      slug: 'TEST_WORKSPACE',
    }
  });

  return workspace;
}

/**
 * Generates a dialogue, connected to a specific dialogue.
 * @param prisma
 * @param customerId
 * @returns
 */
export const seedDialogue = async (prisma: PrismaClient, workspaceId: string) => {
  const dialogue = await prisma.dialogue.create({
    data: {
      customerId: workspaceId,
      title: 'Test dialogue',
      slug: 'TEST_DIALOGUE',
      description: 'A test dialogue',
      questions: {
        create: {
          id: 'TEST_QUESTION_1',
          title: 'Test question',
        }
      }
    }
  });

  return dialogue;
}

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
    }
  });

  const userRole = await prisma.role.create({ data: role });

  const userRoleUser = await prisma.userOfCustomer.create({
    data: {
      customer: { connect: { id: workspaceId } },
      user: { connect: { id: user.id } },
      role: { connect: { id: userRole.id } }
    }
  });

  const token = AuthService.createUserToken(user.id, 22);

  return { user, token, userRole, userRoleUser }
}

const sample = (array: any[]) => {
  return array[Math.floor(Math.random() * array.length)];
}

export const seedSession = async (
  prisma: PrismaClient,
  dialogueId: string,
) => {
  const session = prisma.session.create({
    data: {
      browser: sample(['Firefox', 'IEEdge', 'Chrome', 'Safari']),
      dialogueId,
      device: sample(['iPhone', 'Android', 'Mac', 'Windows ']),
      createdAt: date.recent(),
      nodeEntries: {
        create: [{
          depth: 0,
          relatedNode: {
            create: {
              title: 'Test',
              type: NodeType.SLIDER,
            }
          },
          sliderNodeEntry: {
            create: { value: Math.floor(Math.random() * 100), }
          },
        },
        {
          depth: 1,
          choiceNodeEntry: {
            create: {
              value: sample(['Customer support', 'Facilities', 'Website', 'Application']),
            }
          },
          relatedNode: {
            create: { title: 'What did you think of this?', type: NodeType.CHOICE },
          }
        }
        ],
      }
    }
  });

  return session;
}

export const seedSessions = async (
  prisma: PrismaClient,
  dialogueId: string,
  nrSessions: number
) => {
  Promise.all(Array.from(Array(nrSessions).keys()).map(async () => {
    return seedSession(prisma, dialogueId);
  }));
}
