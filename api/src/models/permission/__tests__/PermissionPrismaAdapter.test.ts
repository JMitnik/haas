import { Prisma } from "@prisma/client";
import cuid from 'cuid';

import { makeTestPrisma } from "../../../test/utils/makeTestPrisma";
import { clearDatabase } from './testUtils';
import PermissionPrismaAdapter from '../PermissionPrismaAdapter';


const prisma = makeTestPrisma();
const permissionPrismaAdapter = new PermissionPrismaAdapter(prisma);

describe('PermissionPrismaAdapter', () => {

    afterEach(async () => {
        await clearDatabase(prisma);
        await prisma.$disconnect();
    });

    test('Find permissions by workspace ID', async () => {
        const customerOne = await prisma.customer.create({
            data: {
                name: 'customerOne',
                slug: 'customerSlugOne',
                permissions: {
                    create: [
                        {
                            name: 'customerOnePermissionOne'
                        },
                        {
                            name: 'customerOnePermissionTwo'
                        }
                    ]
                }
            }
        });

        await prisma.customer.create({
            data: {
                name: 'customerTwo',
                slug: 'customerSlugTwo',
                permissions: {
                    create: [
                        {
                            name: 'customerTwoPermissionOne',
                        },
                    ],
                },
            },
        });

        const permissions = await permissionPrismaAdapter.findPermissionsByCustomerId(customerOne.id);
        expect(permissions).toHaveLength(2);
        expect(permissions[0].name).toBe('customerOnePermissionOne');
    });

    test('Creates a permission', async () => {
        const customer = await prisma.customer.create({
            data: {
                name: 'customerOne',
                slug: 'customerSlugOne',
            }
        });

        await permissionPrismaAdapter.createPermission({
            name: 'permissionOne',
            description: 'descriptionOne',
            customerId: customer.id,
        });

        const permissions = await permissionPrismaAdapter.findPermissionsByCustomerId(customer.id);
        expect(permissions?.[0]?.name).toBe('permissionOne');
        expect(permissions?.[0]?.description).toBe('descriptionOne');
    });

    test('Deletes many permissions by permission IDs', async () => {
        const customer = await prisma.customer.create({
            data: {
                name: 'customerOne',
                slug: 'customerSlugOne',
                permissions: {
                    create: [
                        {
                            name: 'permissionOne',
                            id: 'idOne'
                        },
                        {
                            name: 'permissionTwo',
                            id: 'idTwo',
                        },
                        {
                            name: 'permissionThree',
                            id: 'idThree'
                        }
                    ]
                }
            }
        });

        await permissionPrismaAdapter.deleteMany(['idOne', 'idThree']);
        const permissions = await permissionPrismaAdapter.findPermissionsByCustomerId(customer.id);
        expect(permissions?.[0].id).toBe('idTwo');
    });
});