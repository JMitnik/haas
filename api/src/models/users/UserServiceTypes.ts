import { Customer, Role, User, UserOfCustomer } from "@prisma/client";

export interface DeletedUserOutput {
  deletedUser: boolean;
}

export type UserWithWorkspaces = (User & { customers: (UserOfCustomer & { customer: Customer; role: Role; })[]; });
