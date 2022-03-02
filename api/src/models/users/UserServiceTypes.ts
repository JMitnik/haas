import { Customer, Role, User, UserOfCustomer } from "@prisma/client";

export type UserWithWorkspaces = (User & { customers: (UserOfCustomer & { customer: Customer; role: Role; })[]; });
