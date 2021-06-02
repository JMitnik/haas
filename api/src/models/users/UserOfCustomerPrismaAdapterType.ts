import { UserOfCustomerCreateInput, UserOfCustomer } from "@prisma/client";

export interface UserOfCustomerPrismaAdapterType {
  create(data: UserOfCustomerCreateInput): Promise<UserOfCustomer>;
};