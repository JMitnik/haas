import { Customer, Prisma, Role, User, UserOfCustomer } from 'prisma/prisma-client';

const userWithDialogues = Prisma.validator<Prisma.UserArgs>()({
  include: {
    isAssignedTo: true,
  },
});

export type UserWithAssignedDialogues = Prisma.UserGetPayload<typeof userWithDialogues>;

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
