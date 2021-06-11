import { UserPrismaAdapterType, RegisterUserInput } from "./UserPrismaAdapterType";
import { PrismaClient, UserUpdateInput, UserWhereUniqueInput, UserWhereInput } from "@prisma/client";
import RoleService from '../role/RoleService';
import { RoleServiceType } from "../role/RoleServiceType";

class UserPrismaAdapter implements UserPrismaAdapterType {
  prisma: PrismaClient;
  roleService: RoleServiceType;

  constructor(prismaClient: PrismaClient) {
    this.prisma = prismaClient;
    this.roleService = new RoleService(prismaClient);
  }

  findUserContext(userId: string) {
    return this.prisma.user.findOne({
      where: {
        id: userId,
      },
      include: {
        customers: {
          include: {
            customer: true,
            role: true,
          },
        },
      },
    });
  }

  async registerUser(registerUserInput: RegisterUserInput) {
    return this.prisma.user.create({
      data: {
        email: registerUserInput.email,
        firstName: registerUserInput.firstName,
        lastName: registerUserInput.lastName,
        password: registerUserInput.password,
        customers: {
          create: {
            customer: { connect: { id: registerUserInput.workspaceId || undefined } },
            role: { connect: { id: (await this.roleService.fetchDefaultRoleForCustomer(registerUserInput.workspaceId)).id || undefined } },
          },
        },
      },
      include: {
        customers: {
          include: {
            role: true,
            customer: true,
          },
        },
      },
    });
  }


  async existsWithinWorkspace(email: string, workspaceId: string): Promise<Boolean> {
    const userExists = await this.prisma.user.findFirst({
      where: {
        customers: {
          some: {
            AND: [{
              customerId: workspaceId,
            }, {
              user: {
                email,
              },
            }],
          },
        },
      },
    });
    return userExists ? true : false;
  }

  async findUserWithinWorkspace(email: string, workspaceId: string) {
    return this.prisma.user.findFirst({
      where: { email },
      include: {
        customers: {
          where: { customerId: workspaceId },
        },
      },
    });;
  }

  async findFirst(where: UserWhereInput): Promise<import("@prisma/client").User | null> {
    return this.prisma.user.findFirst({
      where: where,
      include: {
        customers: {
          include: {
            customer: true,
            role: true,
            user: true,
          }
        }
      }
    })
  }

  async update(userId: string | undefined, data: UserUpdateInput): Promise<import("@prisma/client").User> {
    return this.prisma.user.update({
      where: { id: userId },
      data,
    });
  }

  async getValidUsers(loginToken: string, userId: string | undefined) {
    const validUsers = await this.prisma.user.findMany({
      where: {
        AND: {
          loginToken: {
            equals: loginToken,
          },
          id: { equals: userId },
        }
      },
      include: {
        customers: {
          include: {
            customer: true,
            role: true,
          },
        },
      },
    });
    return validUsers;
  }


}

export default UserPrismaAdapter;
