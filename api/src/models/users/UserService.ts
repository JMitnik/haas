import { UserOfCustomer, PrismaClient, Customer, Prisma, User } from '@prisma/client';
import { UserInputError } from 'apollo-server';
import _, { cloneDeep } from 'lodash';

import { FindManyCallBackProps, PaginateProps, paginate } from '../../utils/table/pagination';
import { mailService } from '../../services/mailings/MailService';
import { NexusGenInputs, NexusGenRootTypes } from '../../generated/nexus';
import AuthService from '../auth/AuthService';
import makeInviteTemplate from '../../services/mailings/templates/makeInviteTemplate';
import makeRoleUpdateTemplate from '../../services/mailings/templates/makeRoleUpdateTemplate';
import UserPrismaAdapter from './UserPrismaAdapter';
import { CustomerPrismaAdapter } from '../customer/CustomerPrismaAdapter';
import UserOfCustomerPrismaAdapter from './UserOfCustomerPrismaAdapter';
import { DeletedUserOutput, UserWithWorkspaces } from './UserServiceTypes';
import { offsetPaginate } from '../general/PaginationHelpers';

class UserService {
  prisma: PrismaClient;
  userPrismaAdapter: UserPrismaAdapter;
  customerPrismaAdapter: CustomerPrismaAdapter;
  userOfCustomerPrismaAdapter: UserOfCustomerPrismaAdapter;

  constructor(prismaClient: PrismaClient) {
    this.prisma = prismaClient;
    this.userPrismaAdapter = new UserPrismaAdapter(prismaClient);
    this.customerPrismaAdapter = new CustomerPrismaAdapter(prismaClient);
    this.userOfCustomerPrismaAdapter = new UserOfCustomerPrismaAdapter(prismaClient);
  };

  async deleteUser(userId: string, customerId: string): Promise<DeletedUserOutput> {
    const removedUser = await this.userOfCustomerPrismaAdapter.delete(userId, customerId);
    if (removedUser) return { deletedUser: true };

    return { deletedUser: false };
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

  async getUserCustomers(userId: string) {
    const user = await this.userPrismaAdapter.getUserById(userId);

    if (!user) throw 'No user found!';

    const { customers, ...rest } = user;

    return customers?.map((customerOfUser) => ({
      customer: customerOfUser.customer,
      role: customerOfUser.role,
      user: rest, //TODO: check if changes to rest covers user: parent from resolver (parent === User),
    })) || [];
  };

  async getGlobalPermissions(userId: string) {
    const user = await this.userPrismaAdapter.getUserById(userId);
    return user?.globalPermissions || [];
  };

  async getUserOfCustomer(workspaceId: string | null | undefined, customerSlug: string | null | undefined, userId: string) {
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

  /**
   * Invites a new user to a current customer, and mails them with a login-token.
   */
  async inviteNewUserToCustomer(email: string, customerId: string, roleId: string) {
    const createdUser = await this.userPrismaAdapter.createNewUser(customerId, roleId, email)

    const inviteLoginToken = AuthService.createUserToken(createdUser.id);

    await this.userPrismaAdapter.setLoginToken(createdUser.id, inviteLoginToken);

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
  };

  async updateUserRole(userId: string, newRoleId: string, workspaceId: string) {
    const updatedUser = await this.userOfCustomerPrismaAdapter.updateWorkspaceUserRole(userId, workspaceId, newRoleId);

    const emailBody = makeRoleUpdateTemplate({
      customerName: updatedUser.customer.name,
      recipientMail: updatedUser.user.email,
      newRoleName: updatedUser.role.name
    });

    mailService.send({
      recipient: updatedUser.user.email,
      subject: 'HAAS: New role assigned to you.',
      body: emailBody,
    });
  };

  async inviteExistingUserToCustomer(userId: string, newRoleId: string, workspaceId: string) {
    const invitedUser = await this.userOfCustomerPrismaAdapter.createExistingUserForInvitingWorkspace(workspaceId, newRoleId, userId);

    // TODO: Make instance
    const inviteLoginToken = AuthService.createUserToken(userId);
    await this.userPrismaAdapter.setLoginToken(userId, inviteLoginToken);

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
  };


  static filterBySearchTerm = (
    usersOfCustomer: (UserOfCustomer & {
      user: {
        firstName: string;
        lastName: string;
        email: string;
      },
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
      },
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

    console.log('filter:', filter);

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
