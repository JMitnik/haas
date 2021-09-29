import { makeTestPrisma } from "../../../test/utils/makeTestPrisma";
import SessionPrismaAdapter from "../SessionPrismaAdapter";
import { clearDatabase } from "./testUtils";

const prisma = makeTestPrisma();
const sessionPrismaAdapter = new SessionPrismaAdapter(prisma);


describe('SessionPrismaAdapter', () => {
  afterEach(async () => {
    await clearDatabase(prisma);
    await prisma.$disconnect();
  });

  // test('Updates delivery (connects it to session)', async () => {

  //   const campaign = await prisma.campaign.create({
  //     data: {
  //       label: 'CampaignOne',
  //       workspace: {
  //         create: {
  //           name: 'workspaceOne',
  //           slug: 'workspaceOneSlug',
  //         }
  //       },
  //       variantsEdges: {
  //         create: {
  //           campaignVariant: {
  //             create: {
  //               body: 'variantA',
  //               label: 'Variant A',
  //               type: 'EMAIL',
  //             },
  //           }
  //         }
  //       }

  //     }
  //   })
  //   await prisma.delivery.create({
  //     data: {
  //       id: 'deliveryOne',
  //       scheduledAt: Date(),
  //       currentStatus: 'DELIVERED',
  //       campaignVariant: {
  //         create: {
  //           body: 'campaignBody',
  //           label: 'campaignLabel',
  //           type: 'EMAIL',

  //         }
  //       },
  //       campaign: {
  //         create: {
  //           label: 'CampaignOne',
  //           workspace: {
  //             create: {
  //               name: 'workspaceOne',
  //               slug: 'workspaceOneSlug',
  //             }
  //           }
  //         }
  //       }
  //     }
  //   })
  // });

});
