import { NexusGenInputs } from "../../generated/nexus";
import { User, UserOfCustomer, Customer, Role, SystemPermissionEnum, UserUpdateInput } from "@prisma/client";

export interface UserServiceType {
  createUser(userInput: NexusGenInputs['UserInput']): Promise<User>;
  inviteNewUserToCustomer(email: string, customerId: string, roleId: string): Promise<void>;
  getValidUsers(loginToken: string, userId: string | undefined): Promise<(User & {
    customers: (UserOfCustomer & {
      customer: Customer;
      role: Role;
    })[];
  })[]>;
  setRefreshToken(userId: string, refreshToken: string): Promise<User>;
  setLoginToken(userId: string, loginToken: string): Promise<User>;
  getUserByEmail(emailAddress: string): Promise<User | null>;
  getUserById(userId: string): Promise<User | null>;
  logout(userId: string): Promise<User>;
  findEmailWithinWorkspace(emailAddress: string, workspaceId: string): Promise<User & { customers: UserOfCustomer[]; } | null>
  findUserContext(userId: string): Promise<(User & {
    customers: (UserOfCustomer & {
      customer: Customer;
      role: Role;
    })[];
  }) | null>;
  getRecipientsOfTrigger(triggerId: string): Promise<User[]>;
  getUserOfCustomer(customerId: string | null | undefined, customerSlug: string | null | undefined, userId: string): Promise<(UserOfCustomer & {
    user: User;
    customer: Customer;
    role: Role;
  }) | null>
  getGlobalPermissions(userId: string): Promise<SystemPermissionEnum[]>;
  getUserCustomers(userId: string): Promise<Array<{customer: Customer, role: Role, user: User}>>;
  getCustomersOfUser(userId: string): Promise<Array<Customer>>;
  getRoleOfUser(userId: string, customerSlug: string): Promise<Role | null>;
  getAllUsersByCustomerSlug(customerSlug: string): Promise<User[]>;
  editUser(userUpdateInput: UserUpdateInput, email: string, userId: string, customerId: string | null | undefined, roleId: string | null | undefined): Promise<User>;
  deleteUser(userId: string, customerId: string): Promise<{deletedUser: boolean}>
}