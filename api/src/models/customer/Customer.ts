import { PrismaClient, Customer } from '@prisma/client';
import { objectType, queryType, extendType, inputObjectType, arg } from '@nexus/schema';

import CustomerSettingsType from '../settings/CustomerSettings';
import { DialogueType } from '../questionnaire/Dialogue';

const prisma = new PrismaClient();

const CustomerType = objectType({
  name: 'Customer',
  definition(t) {
    t.id('id');
    t.string('name');
    t.field('settings', {
      type: CustomerSettingsType,
      resolve(parent: Customer, args: any, ctx: any, info: any) {
        const customerSettings = prisma.customerSettings.findOne({ where: { customerId: parent.id } });
        return customerSettings;
      },
    });
    t.list.field('dialogues', {
      type: DialogueType,
      resolve(parent: Customer, args: any, ctx: any, info: any) {
        const dialogues = prisma.dialogue.findMany({
          where: {
            customerId: parent.id,
          },
        });
        return dialogues;
      },
    });
  },
});

export const CustomerWhereUniqueInput = inputObjectType({
  name: 'CustomerWhereUniqueInput',
  definition(t) {
    t.id('id', { required: true });
  },
});

export const DeleteCustomerMutation = extendType({
  type: 'Mutation',
  definition(t) {
    t.field('deleteCustomer', {
      type: CustomerType,
      args: {
        where: CustomerWhereUniqueInput,
      },
      async resolve(parent: any, args: any, ctx: any, info: any) {
        const customerId = args.where.id;
        console.log('Customer ID: ', customerId);

        const customer = await prisma.customer.findOne({ where: { id: customerId },
          include: {
            settings: {
              include: {
                colourSettings: true,
                fontSettings: true,
              },
            },
          } });

        const colourSettingsId = customer?.settings?.colourSettingsId;
        const fontSettingsId = customer?.settings?.fontSettingsId;
        console.log(customer?.settings);

        // //// Settings-related
        if (fontSettingsId) {
          await prisma.fontSettings.delete({
            where: {
              id: fontSettingsId,
            },
          });
        }

        if (colourSettingsId) {
          await prisma.colourSettings.delete({
            where: {
              id: colourSettingsId,
            },
          });
        }

        if (customer?.settings) {
          await prisma.customerSettings.delete({
            where: {
              customerId,
            },
          });
        }

        const dialogueIds = await prisma.dialogue.findMany({
          where: {
            customerId,
          },
          select: {
            id: true,
          },
        });

        // //// Session-related
        if (dialogueIds.length > 0) {
          await Promise.all(dialogueIds.map(async (dialogueId) => {
            const dialogue = await prisma.dialogue.findOne({
              where: {
                id: dialogueId.id,
              },
              include: {
                questions: {
                  select: {
                    id: true,
                  },
                },
                edges: {
                  select: {
                    id: true,
                  },
                },
                session: {
                  select: {
                    id: true,
                  },
                },
              },
            });

            const sessionIds = dialogue?.session.map((session) => session.id);
            const nodeEntries = await prisma.nodeEntry.findMany({ where: {
              sessionId: {
                in: sessionIds,
              },
            } });

            const nodeEntryIds = nodeEntries.map((nodeEntry) => nodeEntry.id);
            // FIXME: nodeEntryValues of leaf node remain in db
            if (nodeEntryIds.length > 0) {
              await prisma.nodeEntryValue.deleteMany(
                { where: {
                  nodeEntryId: {
                    in: nodeEntryIds,
                  },
                } },
              );

              await prisma.nodeEntry.deleteMany(
                { where: {
                  sessionId: {
                    in: sessionIds,
                  },
                } },
              );
            }

            if (sessionIds && sessionIds.length > 0) {
              await prisma.session.deleteMany(
                { where: {
                  id: {
                    in: sessionIds,
                  },
                } },
              );
            }

            // //// Edge-related
            // FIXME: fill edges field dialogue
            // TODO: Cascade delete edgeCondition
            console.log('edges: ', dialogue?.edges);
            const edgeIds = dialogue?.edges && dialogue?.edges.map((edge) => edge.id);
            if (edgeIds && edgeIds.length > 0) {
              await prisma.questionCondition.deleteMany(
                { where: {
                  edgeId: {
                    in: edgeIds,
                  },
                } },
              );

              // TODO: Cascade delete edge
              await prisma.edge.deleteMany(
                { where: {
                  id: {
                    in: edgeIds,
                  },
                } },
              );
            }

            // //// Question-related
            const questionIds = dialogue?.questions.map((question) => question.id);
            if (questionIds && questionIds.length > 0) {
              await prisma.questionOption.deleteMany(
                { where: {
                  questionNodeId: {
                    in: questionIds,
                  },
                } },
              );

              await prisma.questionNode.deleteMany(
                { where: {
                  id: {
                    in: questionIds,
                  },
                } },
              );
            }

            // TODO: Cascade delete dialogue
            await prisma.dialogue.delete({
              where: {
                id: dialogueId.id,
              },
            });
          }));
        }

        const deletedCustomer = await prisma.customer.delete({
          where: {
            id: customerId,
          },
        });
        console.log('Deleted customer: ', deletedCustomer.id);
        return customer;
      },
      // deleteCustomer(where: CustomerWhereUniqueInput!): Customer
    });
  },
});

export const CustomersQuery = extendType({
  type: 'Query',
  definition(t) {
    t.list.field('customers', {
      type: CustomerType,
      resolve(parent: any, args: any, ctx: any, info: any) {
        const customers = prisma.customer.findMany();
        return customers;
      },
    });
  },
});

export default CustomerType;
