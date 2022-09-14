import { createReadStream } from 'fs';

import { makeTestContext } from '../../../test/utils/makeTestContext';
import AuthService from '../../auth/AuthService';
import { prisma } from '../../../test/setup/singletonDeps';
import { clearDatabase, createSuperAdmin, createUserWithAllRoles } from './testUtils';
import { DialogueTemplateType, RoleTypeEnum } from '@prisma/client';
import businessWorkspaceTemplate from '../../../models/templates/businessWorkspaceTemplate';
import englishSportWorkspaceTemplate from '../../../models/templates/sportWorkspaceEngTemplate';
import dutchSportWorkspaceTemplate from '../../../models/templates/sportWorkspaceNlTemplate';
import { generateCreateDialogueDataByTemplateLayers } from '../GenerateWorkspaceService.helpers';

jest.setTimeout(30000);

const ctx = makeTestContext(prisma);

const Mutation = `
  mutation GenerateWorkspaceFromCSV($input: GenerateWorkspaceCSVInputType) {
    generateWorkspaceFromCSV(input: $input) {
      id
      slug
      isDemo
    }
  }
`;

describe('GenerateWorkspaceFromCSV resolver', () => {
  afterEach(async () => {
    await clearDatabase(prisma);
    await prisma.$disconnect();
  });

  it('Cant generate without superAdmin power (Unauthorized)', async () => {
    const userOfCustomer = await createUserWithAllRoles(prisma);
    const userId = userOfCustomer.userId;

    const token = AuthService.createUserToken(userId, 22);
    const file = createReadStream(`${__dirname}/groupCsv.csv`);
    try {
      file.addListener('end', async () => {
        const res = await ctx.client.request(Mutation,
          {
            input: {
              uploadedCsv: file,
              workspaceSlug: 'newWorkspaceSlug',
              workspaceTitle: 'newWorkspaceTitle',
            },
          },
          {
            'Authorization': `Bearer ${token}`,
          }
        );

        expect(res).toMatchObject({
          generateWorkspaceFromCSV: {
            slug: 'newWorkspaceSlug',
          },
        });

      })
    } catch (error) {
      if (error instanceof Error) {
        expect(error.message).toContain('Not Authorised!');
      } else { throw new Error(); }
    }
  })

  it('Generates workspace based on BUSINESS_ENG template and group CSV', async () => {
    const user = await createSuperAdmin(prisma);

    // Generate token for API access
    const token = AuthService.createUserToken(user.id, 22);
    const file = createReadStream(`${__dirname}/groupCsv.csv`);
    file.addListener('end', async () => {
      const res = await ctx.client.request(Mutation,
        {
          input: {
            uploadedCsv: file,
            workspaceSlug: 'newWorkspaceSlug',
            workspaceTitle: 'newWorkspaceTitle',
            managerCsv: undefined,
            type: DialogueTemplateType.BUSINESS_ENG,
            generateDemoData: false,
            isDemo: false,
          },
        },
        {
          'Authorization': `Bearer ${token}`,
        }
      );

      // Verify whether demo workspace is generated or not
      expect(res).toMatchObject({
        generateWorkspaceFromCSV: {
          slug: 'newWorkspaceSlug',
          isDemo: false,
        },
      });

      // Check if all 9 entries in group CSV are generated
      const workspaceId = res.generateWorkspaceFromCSV.id;
      const dialogues = await prisma.dialogue.findMany({
        where: {
          customerId: workspaceId,
        },
      });

      expect(dialogues).toHaveLength(9);

      // Check whether correct template is set for dialogues
      const herenOne = dialogues.find((dialogue) => dialogue.title === 'Seniors-Male-H1');
      expect(herenOne).not.toBeNull();
      expect(herenOne?.template).toBe(DialogueTemplateType.BUSINESS_ENG);

      // Check whether demo data is generated or not
      const dialogueIds = dialogues.map((dialogue) => dialogue.id);
      const sessions = await prisma.session.findMany({
        where: {
          dialogueId: {
            in: dialogueIds,
          },
        },
      });
      expect(sessions).toHaveLength(0);

      // Check whether options match topics in template
      const topics = Object.keys(businessWorkspaceTemplate.topics)
      const options = await prisma.questionOption.findMany({
        where: {
          value: {
            in: topics,
          },
        },
      });
      expect(options.length).toBeGreaterThanOrEqual(topics.length);
    });
  });

  it('Generates demo workspace (and seed data) based on SPORT_ENG template and group CSV', async () => {
    const user = await createSuperAdmin(prisma);

    // Generate token for API access
    const token = AuthService.createUserToken(user.id, 22);
    const file = createReadStream(`${__dirname}/groupCsv.csv`);
    file.addListener('end', async () => {
      const res = await ctx.client.request(Mutation,
        {
          input: {
            uploadedCsv: file,
            workspaceSlug: 'newWorkspaceSlug',
            workspaceTitle: 'newWorkspaceTitle',
            managerCsv: undefined,
            type: DialogueTemplateType.SPORT_ENG,
            generateDemoData: true,
            isDemo: true,
          },
        },
        {
          'Authorization': `Bearer ${token}`,
        }
      );

      // Verify whether demo workspace is generated or not
      expect(res).toMatchObject({
        generateWorkspaceFromCSV: {
          slug: 'newWorkspaceSlug',
          isDemo: true,
        },
      });

      // Check if all 9 entries in group CSV are generated
      const workspaceId = res.generateWorkspaceFromCSV.id;
      const dialogues = await prisma.dialogue.findMany({
        where: {
          customerId: workspaceId,
        },
      });
      expect(dialogues).toHaveLength(9);

      // Check whether correct template is set for dialogues
      const herenOne = dialogues.find((dialogue) => dialogue.title === 'Seniors-Male-H1');
      expect(herenOne).not.toBeNull();
      expect(herenOne?.template).toBe(DialogueTemplateType.SPORT_ENG);

      // Check whether demo data is generated or not
      const dialogueIds = dialogues.map((dialogue) => dialogue.id);
      const sessions = await prisma.session.findMany({
        where: {
          dialogueId: {
            in: dialogueIds,
          },
        },
      });

      expect(sessions.length).toBeGreaterThan(0);

      // Check whether options match topics in template
      const topics = Object.keys(englishSportWorkspaceTemplate.topics)
      const options = await prisma.questionOption.findMany({
        where: {
          value: {
            in: topics,
          },
        },
      });
      expect(options.length).toBeGreaterThanOrEqual(topics.length);
    });
  });

  it('Generates demo workspace (and seed data) based on SPORT_NL template and no CSV', async () => {
    const user = await createSuperAdmin(prisma);

    // Generate token for API access
    const token = AuthService.createUserToken(user.id, 22);
    const res = await ctx.client.request(Mutation,
      {
        input: {
          uploadedCsv: undefined,
          workspaceSlug: 'newWorkspaceSlug',
          workspaceTitle: 'newWorkspaceTitle',
          managerCsv: undefined,
          type: DialogueTemplateType.SPORT_NL,
          generateDemoData: true,
          isDemo: true,
        },
      },
      {
        'Authorization': `Bearer ${token}`,
      }
    );

    // Verify whether demo workspace is generated or not
    expect(res).toMatchObject({
      generateWorkspaceFromCSV: {
        slug: 'newWorkspaceSlug',
        isDemo: true,
      },
    });

    // Check if all 9 entries in group CSV are generated
    const dialogueTargets = generateCreateDialogueDataByTemplateLayers(DialogueTemplateType.SPORT_NL);
    const dialogueTargetsSlugs = dialogueTargets.map((dialogue) => dialogue.slug);

    const workspaceId = res.generateWorkspaceFromCSV.id;
    const dialogues = await prisma.dialogue.findMany({
      where: {
        customerId: workspaceId,
        slug: {
          in: dialogueTargetsSlugs,
        },
      },
    });
    expect(dialogues).toHaveLength(dialogueTargets.length);

    // Check whether correct template is set for dialogues
    const girlsO12 = dialogues.find((dialogue) => dialogue.title === 'Meisjes - O12 - Team2');
    expect(girlsO12).not.toBeNull();
    expect(girlsO12?.template).toBe(DialogueTemplateType.SPORT_NL);

    // Check whether demo data is generated or not
    const dialogueIds = dialogues.map((dialogue) => dialogue.id);
    const sessions = await prisma.session.findMany({
      where: {
        dialogueId: {
          in: dialogueIds,
        },
      },
    });

    expect(sessions.length).toBeGreaterThan(0);

    // Check whether options match topics in template
    const topics = Object.keys(dutchSportWorkspaceTemplate.topics)
    const options = await prisma.questionOption.findMany({
      where: {
        value: {
          in: topics,
        },
      },
    });
    expect(options.length).toBeGreaterThanOrEqual(topics.length);
  });

  it('Generates workspace and additional managers through managers CSV', async () => {
    const user = await createSuperAdmin(prisma);

    // Generate token for API access
    const token = AuthService.createUserToken(user.id, 22);
    const file = createReadStream(`${__dirname}/managerCsv.csv`);
    file.addListener('end', async () => {
      const res = await ctx.client.request(Mutation,
        {
          input: {
            uploadedCsv: undefined,
            workspaceSlug: 'newWorkspaceSlug',
            workspaceTitle: 'newWorkspaceTitle',
            managerCsv: file,
            type: DialogueTemplateType.SPORT_ENG,
            generateDemoData: false,
            isDemo: false,
          },
        },
        {
          'Authorization': `Bearer ${token}`,
        }
      );

      // Verify whether demo workspace is generated or not
      expect(res).toMatchObject({
        generateWorkspaceFromCSV: {
          slug: 'newWorkspaceSlug',
          isDemo: false,
        },
      });

      const workspaceId = res.generateWorkspaceFromCSV.id;

      const usersOfCustomer = await prisma.userOfCustomer.findMany({
        where: {
          customerId: workspaceId,
        },
        include: {
          role: true,
          user: true,
        },
      });
      expect(usersOfCustomer).toHaveLength(4);

      // Check People in managersCSV are added to the workspace
      const managers = usersOfCustomer.filter((userOfCustomer) => userOfCustomer.role.type === RoleTypeEnum.MANAGER);
      const admins = usersOfCustomer.filter((userOfCustomer) => userOfCustomer.role.type === RoleTypeEnum.ADMIN);
      expect(managers).toHaveLength(3);
      // Check that the account who generates workspace is not set manager but remains part of the workspace as an admin
      expect(admins).toHaveLength(1);
    });
  });

  it('Generate workspace with private dialogues', async () => {
    const user = await createSuperAdmin(prisma);

    // Generate token for API access
    const token = AuthService.createUserToken(user.id, 22);
    const file = createReadStream(`${__dirname}/groupCsv.csv`);
    file.addListener('end', async () => {
      const res = await ctx.client.request(Mutation,
        {
          input: {
            uploadedCsv: file,
            workspaceSlug: 'newWorkspaceSlug',
            workspaceTitle: 'newWorkspaceTitle',
            managerCsv: undefined,
            makeDialoguesPrivate: true,
            type: DialogueTemplateType.SPORT_ENG,
            generateDemoData: false,
            isDemo: false,
          },
        },
        {
          'Authorization': `Bearer ${token}`,
        }
      );

      // Verify whether demo workspace is generated or not
      expect(res).toMatchObject({
        generateWorkspaceFromCSV: {
          slug: 'newWorkspaceSlug',
          isDemo: true,
        },
      });

      // Check if all 9 entries in group CSV are generated
      const workspaceId = res.generateWorkspaceFromCSV.id;
      const dialogues = await prisma.dialogue.findMany({
        where: {
          customerId: workspaceId,
        },
      });
      expect(dialogues).toHaveLength(9);

      // Check whether correct privacy settings are set for dialogues
      expect(dialogues[0]?.isPrivate).toBeTruthy();
    });
  });

  it('Generate workspace with public dialogues', async () => {
    const user = await createSuperAdmin(prisma);

    // Generate token for API access
    const token = AuthService.createUserToken(user.id, 22);
    const file = createReadStream(`${__dirname}/groupCsv.csv`);
    file.addListener('end', async () => {
      const res = await ctx.client.request(Mutation,
        {
          input: {
            uploadedCsv: file,
            workspaceSlug: 'newWorkspaceSlug',
            workspaceTitle: 'newWorkspaceTitle',
            managerCsv: undefined,
            makeDialoguesPrivate: false,
            type: DialogueTemplateType.SPORT_ENG,
            generateDemoData: false,
            isDemo: false,
          },
        },
        {
          'Authorization': `Bearer ${token}`,
        }
      );

      // Verify whether demo workspace is generated or not
      expect(res).toMatchObject({
        generateWorkspaceFromCSV: {
          slug: 'newWorkspaceSlug',
          isDemo: true,
        },
      });

      // Check if all 9 entries in group CSV are generated
      const workspaceId = res.generateWorkspaceFromCSV.id;
      const dialogues = await prisma.dialogue.findMany({
        where: {
          customerId: workspaceId,
        },
      });
      expect(dialogues).toHaveLength(9);

      // Check whether correct privacy settings are set for dialogues
      expect(dialogues[0]?.isPrivate).toBe(false);
    });
  });
})
