import { Customer, Role, User, UserOfCustomer } from '@prisma/client';

export interface DeletedUserOutput {
  deletedUser: boolean;
}

export type UserWithWorkspaces = (User & { customers: (UserOfCustomer & { customer: Customer; role: Role })[] });

export interface GenerateReportPayload {
  targets: TargetsPayload[];
}

export type TargetType = 'ROLE' | 'USER';

export interface TargetsPayload {
  type: TargetType;
  label: string;
  value: string;
}