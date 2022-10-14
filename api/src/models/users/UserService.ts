import { UserOfCustomer, PrismaClient, Customer, Prisma, User } from 'prisma/prisma-client';
import { UserInputError } from 'apollo-server';
import _ from 'lodash';

import { mailService } from '../../services/mailings/MailService';
import { NexusGenInputs } from '../../generated/nexus';
import AuthService from '../auth/AuthService';
import makeInviteTemplate from '../../services/mailings/templates/makeInviteTemplate';
import makeRoleUpdateTemplate from '../../services/mailings/templates/makeRoleUpdateTemplate';
import UserPrismaAdapter from './UserPrismaAdapter';
import { CustomerPrismaAdapter } from '../customer/CustomerPrismaAdapter';
import UserOfCustomerPrismaAdapter from './UserOfCustomerPrismaAdapter';
import { DeletedUserOutput, GenerateReportPayload, UserWithAssignedDialogues, UserWithWorkspaces } from './UserServiceTypes';
import { offsetPaginate } from '../general/PaginationHelpers';
import CustomerService from '../../models/customer/CustomerService';
import { assertNonNullish } from '../../utils/assertNonNullish';

class UserService {
  prisma: PrismaClient;
  userPrismaAdapter: UserPrismaAdapter;
  customerPrismaAdapter: CustomerPrismaAdapter;
  userOfCustomerPrismaAdapter: UserOfCustomerPrismaAdapter;
  customerService: CustomerService;

  constructor(prismaClient: PrismaClient) {
    this.prisma = prismaClient;
    this.userPrismaAdapter = new UserPrismaAdapter(prismaClient);
    this.customerPrismaAdapter = new CustomerPrismaAdapter(prismaClient);
    this.userOfCustomerPrismaAdapter = new UserOfCustomerPrismaAdapter(prismaClient);
    this.customerService = new CustomerService(prismaClient);
  };

  public async findAssignedUsers(workspaceSlug: string) {
    const whereInput: Prisma.UserWhereInput = {
      isAssignedTo: {
        some: {
          customer: {
            slug: workspaceSlug,
          },
        },
      },
    };

    // Only Find assigned dialogues
    const users = await this.userPrismaAdapter.findMany(whereInput, {
      isAssignedTo: {
        where: {
          customer: {
            slug: workspaceSlug,
          },
        },
      },
    }) as UserWithAssignedDialogues[];

    return users;
  }

  /**
   * Finds all users based on a AutomationAction payload
   * @param workspaceSlug
   * @param targetIds
   * @returns a list of users
   */
  findTargetUsers = async (workspaceSlug: string, payload: GenerateReportPayload) => {
    const targets = payload?.targets;
    const roleIds: string[] = [];
    const userIds: string[] = [];

    targets.forEach((target) => {
      if (target.type === 'ROLE') {
        roleIds.push(target.value);
      };

      if (target.type === 'USER') {
        userIds.push(target.value);
      }
    });

    const targetIds = { roleIds, userIds };

    return this.userOfCustomerPrismaAdapter.findTargetUsers(workspaceSlug, targetIds);
  };

  /*
   * Creates a "root" user without any workspace associated.
   */
  public async createUser(email: string, firstName: string, lastName: string, isSuperAdmin: boolean) {
    return this.userPrismaAdapter.upsertUserByEmail({
      email,
      firstName,
      lastName,
      globalPermissions: {
        set: isSuperAdmin ? ['CAN_ACCESS_ADMIN_PANEL'] : [],
      },
    })
  }

  /**
   * Finds all private dialogues of a workspace and connects them to a user
   * @param userId
   * @param workspaceId
   */
  connectPrivateDialoguesToUser = async (userId: string, workspaceId: string) => {
    const customerWithDialogues = await this.customerPrismaAdapter.findPrivateDialoguesOfWorkspace(workspaceId);
    const privateDialogueIds = customerWithDialogues?.dialogues.map((dialogue) => ({ id: dialogue.id })) || [];
    await this.userOfCustomerPrismaAdapter.connectPrivateDialoguesToUser(userId, privateDialogueIds);
  }

  /**
   * Upserts a user by checking if the email already exists or not
   * @param input
   * @returns
   */
  upsertUserByEmail = async (input: Prisma.UserCreateInput) => {
    return this.userPrismaAdapter.upsertUserByEmail(input);
  }

  /**
   * Finds the private dialogues of a user as well as all private dialogues within a workspace
   * @param input
   * @param userId
   * @returns
   */
  findPrivateDialoguesOfUser = async (input: NexusGenInputs['UserOfCustomerInput'], userId?: string) => {
    const allPrivateDialoguesWorkspace = await this.customerPrismaAdapter.findPrivateDialoguesOfWorkspace(
      input?.workspaceId || input?.customerId || undefined,
      input?.customerSlug || undefined,
    );

    const user = await this.userPrismaAdapter.findPrivateDialogueOfUser(userId || input?.userId as string);

    return {
      assignedDialogues: user?.isAssignedTo || [],
      privateWorkspaceDialogues: allPrivateDialoguesWorkspace?.dialogues || [],
    }
  }

  /**
   * Assigns user to all private dialogues within a workspace
   * @param userId
   * @param workspaceId
   */
  public async assignUserToAllPrivateDialogues(userId: string, workspaceId: string) {
    const workspace = await this.customerService.findPrivateDialoguesOfWorkspace(workspaceId);
    assertNonNullish(workspace?.dialogues, 'No private dialogues found for workspace');

    const dialogueIds = workspace.dialogues.map((dialogue) => dialogue.id);

    await this.userPrismaAdapter.updateUserPrivateDialogues({
      userId,
      workspaceId,
      assignedDialogueIds: dialogueIds,
    });
  }

  /**
   * Adjusts the dialogue privacy settings of a dialogue for a user based on the input.
   * @param input
   * @returns
   */
  public async assignUserToDialogue(input: NexusGenInputs['AssignUserToDialogueInput']) {
    const updatedUser = await this.userPrismaAdapter.updateDialogueAssignmentOfUser(input);

    return updatedUser;
  };

  /**
   * Adjusts the dialogue privacy settings of a user based on the input.
   * @param input
   * @returns
   */
  assignUserToPrivateDialogues = async (input: NexusGenInputs['AssignUserToDialoguesInput']) => {
    const updatedUser = await this.userPrismaAdapter.updateUserPrivateDialogues(input);

    const allPrivateDialoguesWorkspace = await this.customerPrismaAdapter.findPrivateDialoguesOfWorkspace(
      input.workspaceId
    );

    return {
      ...updatedUser,
      privateDialogues: {
        assignedDialogues: updatedUser.isAssignedTo || [],
        privateWorkspaceDialogues: allPrivateDialoguesWorkspace?.dialogues || [],
      },
    }
  };

  async deleteUser(userId: string, customerId: string): Promise<DeletedUserOutput> {
    const removedUser = await this.userOfCustomerPrismaAdapter.delete(userId, customerId);
    if (removedUser) return { deletedUser: true };

    return { deletedUser: false };
  };

  async updateLastSeen(userId: string) {
    return this.userPrismaAdapter.updateLastSeen(userId, new Date());
  };

  async editUser(
    userUpdateInput: Prisma.UserUpdateInput,
    email: string,
    userId: string,
    customerId: string | null | undefined,
    roleId: string | null | undefined
  ) {
    const emailExists = await this.userPrismaAdapter.emailExists(email, userId);

    if (emailExists) throw new UserInputError('Email is already taken');

    if (!email) throw new UserInputError('No valid email provided');

    if (customerId) {
      await this.userOfCustomerPrismaAdapter.updateWorkspaceUserRole(userId, customerId, roleId);
    };

    return this.userPrismaAdapter.update(userId, userUpdateInput);
  };

  getAllUsersByCustomerSlug(customerSlug: string): Promise<User[]> {
    return this.userPrismaAdapter.getAllUsersByCustomerSlug(customerSlug);
  };

  async getRoleOfWorkspaceUser(userId: string, customerSlug: string) {
    const user = await this.userPrismaAdapter.getUserById(userId);

    if (!user) throw 'No user found!';

    const userCustomer = user.customers.find((cus: any) => (
      cus.customer.slug === customerSlug
    ));

    const role = userCustomer?.role || null;
    return role;
  };

  async getCustomersOfUser(userId: string): Promise<Customer[]> {
    const user = await this.userPrismaAdapter.getUserById(userId);
    return user?.customers.map((customerOfUser) => customerOfUser.customer) || [];
  };

  async findActiveWorkspacesOfUser(userId: string) {
    const userWorkspaces = await this.userPrismaAdapter.findAllWorkspacesByUserId(userId)
    const activeUserWorkspacesRelations = userWorkspaces.filter((userInWorkspace) => userInWorkspace.isActive);
    const activeWorkspaces = activeUserWorkspacesRelations.map((workspaceRelation) => workspaceRelation.customer);

    return activeWorkspaces;
  }

  async getUserCustomers(userId: string) {
    const user = await this.userPrismaAdapter.getUserById(userId);

    if (!user) throw 'No user found!';

    const { customers, ...rest } = user;

    return customers?.map((customerOfUser) => ({
      createdAt: customerOfUser.createdAt,
      isActive: customerOfUser.isActive,
      customer: customerOfUser.customer,
      role: customerOfUser.role,
      user: rest, //TODO: check if changes to rest covers user: parent from resolver (parent === User),
    })) || [];
  };

  async getGlobalPermissions(userId: string) {
    const user = await this.userPrismaAdapter.getUserById(userId);
    return user?.globalPermissions || [];
  };

  /**
   * Finds the bot account within a workspace
   * @param workspaceName the slug of the workspace
   * @returns the bot account within a workspace
   */
  async findBotByWorkspaceName(workspaceSlug: string) {
    const botEmail = `${workspaceSlug}@haas.live`
    return this.userPrismaAdapter.getUserByEmail(botEmail);
  }

  async getUserOfCustomer(
    workspaceId: string | null | undefined,
    customerSlug: string | null | undefined,
    userId: string
  ) {
    let customerId = '';
    if (!workspaceId && customerSlug) {
      const customer = await this.customerPrismaAdapter.findWorkspaceBySlug(customerSlug)
      customerId = customer?.id || '';
    } else {
      customerId = workspaceId || '';
    };

    const userWithCustomer = await this.userOfCustomerPrismaAdapter.findUserCustomerByIds(customerId, userId);
    if (!userWithCustomer) return null;
    return userWithCustomer;
  };

  getRecipientsOfTrigger(triggerId: string): Promise<User[]> {
    return this.userPrismaAdapter.getUsersByTriggerId(triggerId);
  };

  findUserContext(userId: string) {
    return this.userPrismaAdapter.findUserContext(userId);
  };

  findEmailWithinWorkspace(emailAddress: string, workspaceId: string) {
    return this.userPrismaAdapter.findUserWithinWorkspace(emailAddress, workspaceId);
  };

  logout(userId: string): Promise<User> {
    return this.userPrismaAdapter.logout(userId);
  };

  setLoginToken(userId: string, loginToken: string): Promise<User> {
    return this.userPrismaAdapter.setLoginToken(userId, loginToken);
  };

  async getUserById(userId: string) {
    return this.userPrismaAdapter.getUserById(userId);
  };

  async getUserByEmail(emailAddress: string): Promise<User | null> {
    return this.userPrismaAdapter.getUserByEmail(emailAddress);
  };

  async login(userId: string, refreshToken: string): Promise<User> {
    return this.userPrismaAdapter.login(userId, refreshToken);
  };

  async getValidUsers(loginToken: string, userId: string | undefined): Promise<UserWithWorkspaces[]> {
    return this.userPrismaAdapter.getValidUsers(loginToken, userId);
  };

  async setUserStateInWorkspace(input: { userId: string; workspaceId: string; isActive: boolean }) {
    return this.userPrismaAdapter.setIsActive(input);
  }

  /**
   * Send an invitation email to a user of a customer
   * @param invitedUser
   */
  sendInvitationMail = async (
    invitedUser: UserOfCustomer & {
      customer: {
        id: string;
        name: string;
        settings: {
          colourSettings: {
            primary: string;
          } | null;
        } | null;
      };
      user: User;
    }, noConsole?: boolean) => {
    const inviteLoginToken = AuthService.createUserToken(invitedUser.userId);
    await this.userPrismaAdapter.setLoginToken(invitedUser.userId, inviteLoginToken);

    const emailBody = makeInviteTemplate({
      customerName: invitedUser.customer.name,
      recipientMail: invitedUser.user.email,
      token: inviteLoginToken,
      bgColor: invitedUser.customer.settings?.colourSettings?.primary,
    });

    mailService.send({
      recipient: invitedUser.user.email,
      subject: `HAAS: You have been invited to ${invitedUser.customer.name}`,
      body: emailBody,
      noConsole,
    });
  }

  /**
   * Invites a new user to a current customer, and mails them with a login-token.
   */
  async inviteNewUserToCustomer(email: string, customerId: string, roleId: string, sendInviteEmail: boolean) {
    const createdUser = await this.userPrismaAdapter.createWorkspaceUser(customerId, roleId, email)

    const inviteLoginToken = AuthService.createUserToken(createdUser.id);

    await this.userPrismaAdapter.setLoginToken(createdUser.id, inviteLoginToken);

    if (sendInviteEmail) {
      const emailBody = makeInviteTemplate({
        customerName: createdUser.customers[0].customer.name,
        recipientMail: email,
        token: inviteLoginToken,
        bgColor: createdUser.customers[0].customer.settings?.colourSettings?.primary,
      });

      mailService.send({
        recipient: email,
        subject: 'Welcome to HAAS!',
        body: emailBody,
      });
    }
  };

  async updateUserRole(userId: string, newRoleId: string, workspaceId: string, sendInviteEmail: boolean) {
    const updatedUser = await this.userOfCustomerPrismaAdapter.updateWorkspaceUserRole(userId, workspaceId, newRoleId);

    if (sendInviteEmail) {
      const emailBody = makeRoleUpdateTemplate({
        customerName: updatedUser.customer.name,
        recipientMail: updatedUser.user.email,
        newRoleName: updatedUser.role.name,
      });

      mailService.send({
        recipient: updatedUser.user.email,
        subject: 'HAAS: New role assigned to you.',
        body: emailBody,
      });
    }
  };

  async inviteExistingUserToCustomer(userId: string, newRoleId: string, workspaceId: string, sendInviteEmail: boolean) {
    const invitedUser = await this.userOfCustomerPrismaAdapter.createExistingUserForInvitingWorkspace(
      workspaceId,
      newRoleId,
      userId
    );

    // TODO: Make instance
    const inviteLoginToken = AuthService.createUserToken(userId);
    await this.userPrismaAdapter.setLoginToken(userId, inviteLoginToken);

    if (sendInviteEmail) {
      const emailBody = makeInviteTemplate({
        customerName: invitedUser.customer.name,
        recipientMail: invitedUser.user.email,
        token: inviteLoginToken,
        bgColor: invitedUser.customer.settings?.colourSettings?.primary,
      });

      mailService.send({
        recipient: invitedUser.user.email,
        subject: `HAAS: You have been invited to ${invitedUser.customer.name}`,
        body: emailBody,
      });
    }
  };


  static filterBySearchTerm = (
    usersOfCustomer: (UserOfCustomer & {
      user: {
        firstName: string;
        lastName: string;
        email: string;
      };
      role: {
        name: string;
      };
    })[],
    searchTerm: string | null | undefined,
  ) => {
    if (!searchTerm) return usersOfCustomer;

    const filtered = usersOfCustomer.filter((userOfCustomer) => {
      if (userOfCustomer?.user?.email?.toLowerCase().includes(searchTerm.toLowerCase())) {
        return true;
      }
      if (userOfCustomer?.user?.firstName?.toLowerCase().includes(searchTerm.toLowerCase())) {
        return true;
      }
      if (userOfCustomer?.user?.lastName?.toLowerCase().includes(searchTerm.toLowerCase())) {
        return true;
      }
      if (userOfCustomer?.role?.name?.toLowerCase().includes(searchTerm.toLowerCase())) {
        return true;
      }
      return false;
    });

    return filtered;
  };

  static orderUsersBy = (
    usersOfCustomer: (UserOfCustomer & {
      user: {
        firstName: string;
        lastName: string;
        email: string;
      };
      role: {
        name: string;
      };
    })[],
    orderBy: any,
  ) => {
    if (orderBy.by === 'firstName') {
      return _.orderBy(usersOfCustomer, (userOfCustomer) => userOfCustomer.user.firstName, orderBy.desc ? 'desc' : 'asc');
    } if (orderBy.by === 'lastName') {
      return _.orderBy(usersOfCustomer, (userOfCustomer) => userOfCustomer.user.lastName, orderBy.desc ? 'desc' : 'asc');
    } if (orderBy.by === 'email') {
      return _.orderBy(usersOfCustomer, (userOfCustomer) => userOfCustomer.user.email, orderBy.desc ? 'desc' : 'asc');
    } if (orderBy.by === 'role') {
      return _.orderBy(usersOfCustomer, (userOfCustomer) => userOfCustomer.role.name, orderBy.desc ? 'desc' : 'asc');
    }

    return usersOfCustomer;
  };

  paginatedUsers = async (
    customerSlug: string,
    filter?: NexusGenInputs['UserConnectionFilterInput'] | null,
  ) => {
    const offset = filter?.offset ?? 0;
    const perPage = filter?.perPage ?? 5;

    const users = await this.userPrismaAdapter.findPaginatedUsers(customerSlug, filter);
    const totalUsers = await this.userPrismaAdapter.countUsers(customerSlug, filter);

    const { totalPages, ...pageInfo } = offsetPaginate(totalUsers, offset, perPage);

    return {
      userCustomers: users,
      totalPages,
      pageInfo,
    };
  };
}

export default UserService;
