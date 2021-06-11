import { UserOfCustomerCreateInput, UserOfCustomer, User, Customer, Role, UserOfCustomerUpdateInput } from "@prisma/client";

export interface UserOfCustomerPrismaAdapterType {
  create(data: UserOfCustomerCreateInput): Promise<UserOfCustomer>;
  getByIds(customerId: string, userId: string): Promise<(UserOfCustomer & {
    user: User;
    customer: Customer;
    role: Role;
  }) | null>;
  update(userId: string, customerId: string, data: UserOfCustomerUpdateInput): Promise<UserOfCustomer>;
  delete(userId: string, customerId: string): Promise<UserOfCustomer>;
};