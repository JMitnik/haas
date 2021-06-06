import { NexusGenInputs } from "../../generated/nexus";
import { User, UserOfCustomer, Customer, Role } from "@prisma/client";

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
  }) | null>
}