import { PrismaClient } from "@prisma/client";

export const clearDatabase = async (prisma: PrismaClient) => {
    const delPermissions = prisma.permission.deleteMany({ });
    const delCustomers = prisma.customer.deleteMany({ });

    await prisma.$transaction([
        delPermissions,
        delCustomers
    ]);
};