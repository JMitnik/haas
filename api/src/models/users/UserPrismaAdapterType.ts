import { User, UserOfCustomer, Customer, Role, UserUpdateInput, UserWhereUniqueInput, UserWhereInput, UserInclude } from "@prisma/client";

export interface RegisterUserInput {
  email: string,
  firstName: string,
  lastName: string,
  password: string,
  workspaceId: string
}

export interface UserPrismaAdapterType {
  getValidUsers(loginToken: string, userId: string | undefined): Promise<(User & {
    customers: (UserOfCustomer & {
      customer: Customer;
      role: Role;
    })[];
  })[]>;
  update(userId: string, data: UserUpdateInput): Promise<User>;
  findFirst(where: UserWhereInput): Promise<User & {
    customers: (UserOfCustomer & {
      customer: Customer;
      role: Role;
      user: User;
    })[];
  }>;
  findUserWithinWorkspace(email: string, workspaceId: string): Promise<User & { customers: UserOfCustomer[]; } | null>;
  existsWithinWorkspace(email: string, workspaceId: string): Promise<Boolean>;
  registerUser(registerUserInput: RegisterUserInput): Promise<User & {
    customers: (UserOfCustomer & {
      role: Role;
      customer: Customer;
    })[];
  } | null>;
  findUserContext(userId: string): Promise<(User & {
    customers: (UserOfCustomer & {
      customer: Customer;
      role: Role;
    })[];
  }) | null>
  findManyByTriggerId(triggerId: string): Promise<User[]>;
  findManyByCustomerSlug(customerSlug: string): Promise<User[]>;
  emailExists(email: string, userId: string): Promise<Boolean>;
}