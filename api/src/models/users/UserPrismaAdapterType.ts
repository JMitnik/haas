import { User, UserOfCustomer, Customer, Role, UserUpdateInput, UserWhereInput } from "@prisma/client";

export interface RegisterUserInput {
  email: string,
  firstName: string,
  lastName: string,
  password: string,
  workspaceId: string
}