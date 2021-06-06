import { User, UserOfCustomer, Customer, Role, UserUpdateInput, UserWhereUniqueInput, UserWhereInput } from "@prisma/client";

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
  findFirst(where: UserWhereInput): Promise<User | null>;
  findUserWithinWorkspace(email: string, workspaceId: string): Promise<User & { customers: UserOfCustomer[]; } | null>;
  existsWithinWorkspace(email: string, workspaceId: string): Promise<Boolean>;
  registerUser(registerUserInput: RegisterUserInput): Promise<User & {
    customers: (UserOfCustomer & {
      role: Role;
      customer: Customer;
    })[];
  } | null>
}