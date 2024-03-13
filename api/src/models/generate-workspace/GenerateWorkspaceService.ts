import { DialogueTemplateType, PrismaClient, Role, RoleTypeEnum } from 'prisma/prisma-client';
import { ApolloError } from 'apollo-server-express';
import { GraphQLYogaError } from '@graphql-yoga/node';

import TemplateService from '../templates/TemplateService';
import { NexusGenEnums } from '../../generated/nexus';
import { parseCsv } from '../../utils/parseCsv';
import { CustomerPrismaAdapter } from '../customer/CustomerPrismaAdapter';
import DialoguePrismaAdapter from '../questionnaire/DialoguePrismaAdapter';
import { CreateDialogueInput } from '../questionnaire/DialoguePrismaAdapterType';
import NodeService from '../QuestionNode/NodeService';
import UserOfCustomerPrismaAdapter from '../users/UserOfCustomerPrismaAdapter';
import { generateCreateDialogueDataByTemplateLayers, getTemplate } from './GenerateWorkspaceService.helpers';
import SessionPrismaAdapter from '../session/SessionPrismaAdapter';
import DialogueService from '../questionnaire/DialogueService';
import { DemoWorkspaceTemplate } from '../templates/TemplateTypes';
import UserService from '../../models/users/UserService';
import { GenerateWorkspaceCSVInput, Workspace } from './GenerateWorkspace.types';
import CustomerService from '../../models/customer/CustomerService';
import { logger } from '../../config/logger';
import { ActionRequestPrismaAdapter } from '../ActionRequest/ActionRequestPrismaAdapter';

class GenerateWorkspaceService {
  customerPrismaAdapter: CustomerPrismaAdapter;
  dialoguePrismaAdapter: DialoguePrismaAdapter;
  nodeService: NodeService;
  userOfCustomerPrismaAdapter: UserOfCustomerPrismaAdapter;
  sessionPrismaAdapter: SessionPrismaAdapter;
  templateService: TemplateService;
  dialogueService: DialogueService;
  customerService: CustomerService;
  userService: UserService;
  actionRequestPrismaAdapter: ActionRequestPrismaAdapter;

  constructor(prismaClient: PrismaClient) {
    this.customerPrismaAdapter = new CustomerPrismaAdapter(prismaClient);
    this.dialoguePrismaAdapter = new DialoguePrismaAdapter(prismaClient);
    this.nodeService = new NodeService(prismaClient);
    this.userOfCustomerPrismaAdapter = new UserOfCustomerPrismaAdapter(prismaClient);
    this.sessionPrismaAdapter = new SessionPrismaAdapter(prismaClient);
    this.templateService = new TemplateService(prismaClient);
    this.dialogueService = new DialogueService(prismaClient);
    this.customerService = new CustomerService(prismaClient);
    this.userService = new UserService(prismaClient);
    this.actionRequestPrismaAdapter = new ActionRequestPrismaAdapter(prismaClient);
  };

  /**
   * Resets data (removes and re-creates) of a demo workspace
   * @param workspaceId
   * @returns
   */
  resetWorkspaceData = async (workspaceId: string) => {
    const workspace = await this.customerService.findWorkspaceById(workspaceId);

    if (!workspace?.isDemo) {
      throw new ApolloError('Workpace is not a demo workspace! Abort reset.');
    };

    // Find all sessions
    const sessions = await this.sessionPrismaAdapter.findCustomerSessions(workspaceId);
    const sessionIds = sessions.map((session) => session.id);

    // Delete all action requests connected prev sessions
    await this.actionRequestPrismaAdapter.deleteMany({
      session: {
        id: {
          in: sessionIds,
        },
      },
    });

    await this.sessionPrismaAdapter.deleteMany(sessionIds);

    const dialogues = await this.dialogueService.findDialoguesByCustomerId(workspaceId);
    for (const dialogue of dialogues) {
      const template = this.templateService.findTemplate(dialogue.template as DialogueTemplateType);
      await this.dialogueService.massGenerateFakeData(
        dialogue.id, template, 1, true, 2, 70, 80
      );
    }

    return true;
  }

  /**
   * Generates dialogues based on the layers (rootLayer + subLayer) of a template
   * @param workspace
   * @param templateType
   * @param sessionsPerDay
   * @param generateData
   */
  async generateDialoguesByTemplateLayers(
    workspace: Workspace,
    templateType: string,
    sessionsPerDay: number = 1,
    generateData: boolean = false,
    makeDialoguePrivate: boolean = false,
    minScore: number = 70,
    maxScore: number = 80
  ) {
    const mappedDialogueInputData = generateCreateDialogueDataByTemplateLayers(templateType);

    for (let i = 0; i < mappedDialogueInputData.length; i++) {
      const { slug, title } = mappedDialogueInputData[i];
      const template = this.templateService.findTemplate(templateType as NexusGenEnums['DialogueTemplateType']);

      const dialogueInput: CreateDialogueInput = {
        slug: slug,
        title: title,
        description: '',
        customer: { id: workspace.id, create: false },
        isPrivate: makeDialoguePrivate,
        postLeafText: template?.postLeafText,
        language: template.language,
        template: Object.values(DialogueTemplateType).includes(templateType as any)
          ? templateType as DialogueTemplateType
          : undefined,
      };

      // Create initial dialogue
      const dialogue = await this.dialoguePrismaAdapter.createTemplate(dialogueInput);

      if (!dialogue) throw new ApolloError('ERROR: No dialogue created! aborting...');
      // Make post leaf node if data specified in template
      await this.templateService.createTemplatePostLeafNode(template, dialogue.id);

      // Make the leafs
      const leafs = await this.templateService.createTemplateLeafNodes(templateType as NexusGenEnums['DialogueTemplateType'], dialogue.id, []);

      // Make nodes
      if (!template.structure) throw new GraphQLYogaError('Now dialogue structure provided in template. abort.');
      await this.templateService.createDialogueStructure(
        template,
        null,
        template.structure || [],
        dialogue.id,
        leafs
      );

      // Generate data
      if (generateData) {
        await this.dialogueService.massGenerateFakeData(
          dialogue.id, template, sessionsPerDay, true, 2, minScore, maxScore
        );
      }
    }
  }

  /**
   * Based on a top down user csv, upsert available users and assign all existing private dialogues to them
   * @param managerCsv
   * @param workspace
   */
  addManagersToWorkspace = async (managerCsv: any, workspace: Workspace) => {
    let records = await parseCsv(await managerCsv, { delimiter: ';' });

    const managerRole = workspace.roles.find((role) => role.type === RoleTypeEnum.MANAGER) as Role;

    for (let i = 0; i < records.length; i++) {
      const record = records[i];
      const userEmailEntry = Object.entries(record).find((entry) => entry[0] === 'email');
      const userRoleEntry = Object.entries(record).find((entry) => entry[0] === 'role');
      const userPhoneEntry = Object.entries(record).find((entry) => entry[0] === 'phone_number?');
      const userLastNameEntry = Object.entries(record).find((entry) => entry[0] === 'last_name?');
      const userFirstNameEntry = Object.entries(record).find((entry) => entry[0] === 'first_name?');
      const sendInviteEntry = Object.entries(record).find((entry) => entry[0] === 'send_invite?');
      const hasEmailAssignee = !!userEmailEntry?.[1];
      const hasSendInviteInfo = !!userEmailEntry?.[1]
      const emailAssignee = userEmailEntry?.[1] as string;
      const phoneAssignee = userPhoneEntry?.[1] as string | undefined;
      const firstNameAssignee = userFirstNameEntry?.[1] as string | undefined;
      const lastNameAssignee = userLastNameEntry?.[1] as string | undefined;
      const roleAssignee = userRoleEntry?.[1] as RoleTypeEnum | undefined;
      const sendInviteToAssignee = hasSendInviteInfo ?
        (sendInviteEntry?.[1] as string)?.toUpperCase() === 'NO' ? false : true
        : true as boolean;

      const dbRole = roleAssignee && Object.keys(workspace.roles.map((role) => role.type).includes(roleAssignee))
        ? workspace.roles.find((role) => role.type === roleAssignee) as Role
        : managerRole;

      if (!hasEmailAssignee || !emailAssignee || !dbRole) continue;

      const user = await this.userService.upsertUserByEmail({
        email: emailAssignee,
        phone: phoneAssignee,
        firstName: firstNameAssignee,
        lastName: lastNameAssignee,
      });

      const invitedUser = await this.userOfCustomerPrismaAdapter.upsertUserOfCustomer(
        workspace.id,
        user.id,
        dbRole.id,
      );

      if (sendInviteToAssignee) {
        void this.userService.sendInvitationMail(invitedUser, true);
      }
    }
  }

  /**
   * Creates
   * @param contactsEntry
   * @param workspace
   * @returns
   */
  private async upsertUsersWorkspace(emailAddresses: string[], workspace: Workspace) {
    const managerRole = workspace.roles.find((role) => role.type === RoleTypeEnum.MANAGER) as Role;

    const userIds = await Promise.all(emailAddresses.map(async (contact) => {
      const user = await this.userService.upsertUserByEmail({
        email: contact,
      })

      await this.userOfCustomerPrismaAdapter.upsertUserOfCustomer(
        workspace.id,
        user.id,
        managerRole.id,
      );

      return user.id;
    }));

    return userIds;
  }

  /**
   * Generates Dialogues based on CSV records
   * @param workspace
   * @param type
   * @param template
   * @param records
   * @param userId
   * @param generateData
   */
  private async generateDialoguesByCSVRecords(
    workspace: Workspace,
    type: string,
    template: DemoWorkspaceTemplate,
    records: any[],
    userId?: string,
    generateData = false,
    makeDialoguePrivate = false,
  ) {
    const adminRole = workspace.roles.find((role) => role.type === RoleTypeEnum.ADMIN) as Role;

    for (let i = 0; i < records.length; i++) {
      const record = records[i];
      const layers = Object.entries(record).filter((entry) => entry[0].toLowerCase().includes('layer') && (entry[1] as string)?.length > 0);
      const layersContent = layers.map((layer) => (layer[1] as string).replaceAll('-', ''));
      const dialogueSlug = layersContent.join('-').replaceAll(/[^a-zA-Z0-9&]/g, '-').replaceAll(/[--]+/g, '-').toLowerCase();
      const dialogueTitle = layersContent.join(' - ');

      const userEmailEntry = Object.entries(record).find((entry) => entry[0] === 'limited_access_assignee_email?');
      const userPhoneEntry = Object.entries(record).find((entry) => entry[0] === 'limited_access_assignee_phone?');

      const hasEmailAssignee = !!userEmailEntry?.[1];
      const emailAssignee = userEmailEntry?.[1] as string;
      const phoneAssignee = userPhoneEntry?.[1] as string | undefined;

      const userRole = workspace.roles.find((role) => role.type === RoleTypeEnum.USER);

      const dialogueInput: CreateDialogueInput = {
        slug: dialogueSlug,
        title: dialogueTitle,
        description: '',
        customer: { id: workspace.id, create: false },
        isPrivate: makeDialoguePrivate || hasEmailAssignee,
        postLeafText: {
          header: template.postLeafText?.header,
          subHeader: template.postLeafText?.subHeader,
        },
        language: template.language,
        template: Object.values(DialogueTemplateType).includes(type as any)
          ? type as DialogueTemplateType
          : undefined,
      };

      // Create initial dialogue
      const dialogue = await this.dialoguePrismaAdapter.createTemplate(dialogueInput);

      if (!dialogue) throw new ApolloError('ERROR: No dialogue created! aborting...');

      const contactsEntry = Object.entries(record).find((entry) => entry[0] === 'contacts');
      const hasContacts = !!contactsEntry?.[1];

      const contactEmails = hasContacts ? (contactsEntry?.[1] as string)?.trim().replaceAll(' ', '').split(',') : [];
      let contactIds: string[] = [];

      if (hasContacts) {
        contactIds = await this.upsertUsersWorkspace(contactEmails, workspace);
      }

      // Make the leafs
      const leafs = await this.templateService.createTemplateLeafNodes(type as NexusGenEnums['DialogueTemplateType'], dialogue.id, contactIds);

      // Make nodes
      if (!template.structure) throw new GraphQLYogaError('Now dialogue structure provided in template. abort.');
      await this.templateService.createDialogueStructure(
        template,
        null,
        template.structure || [],
        dialogue.id,
        leafs
      );

      // Generate data
      if (generateData) {
        await this.dialogueService.massGenerateFakeData(
          dialogue.id,
          template,
          1,
          true,
          2,
          70,
          80
        );
      }

      // Check if user already exists
      // If not create new user entry + userOfCustomer entry
      // If exists => connect existing user when creating new userOfCustomer entry
      if (!hasEmailAssignee || !emailAssignee || !userRole) continue;

      const limitedUser = await this.userService.upsertUserByEmail({
        email: emailAssignee,
        phone: phoneAssignee,
      });

      await this.userOfCustomerPrismaAdapter.upsertUserOfCustomer(
        workspace.id,
        limitedUser.id,
        limitedUser.id === userId ? adminRole?.id as string : userRole.id, // If user generating is upserted => give admin role
      );

      await this.userOfCustomerPrismaAdapter.addUserToPrivateDialogue(
        emailAssignee,
        dialogue.id,
        phoneAssignee
      );
    };
  };

  /**
   * Creates a bot user for a workspace
   * @param workspace
   */
  private async createBotUser(workspace: Workspace) {
    const botUser = await this.userService.upsertUserByEmail({
      email: `${workspace.slug}@haas.live`,
      firstName: workspace.slug,
      lastName: 'Bot',
    });
    const botRole = workspace.roles.find((role) => role.type === RoleTypeEnum.BOT) as Role;
    await this.userOfCustomerPrismaAdapter.upsertUserOfCustomer(workspace.id, botUser.id, botRole.id);
  }

  /**
   * Generates a workspace based on the content of a CSV
   * @param input
   * @returns the created workspace
   */
  async generateWorkspace(input: GenerateWorkspaceCSVInput, userId?: string) {
    const { uploadedCsv, workspaceSlug, workspaceTitle, type, managerCsv, isDemo, makeDialoguesPrivate } = input;

    const template = getTemplate(type);

    const workspace = await this.customerPrismaAdapter.createWorkspace({
      name: workspaceTitle,
      primaryColour: '',
      logo: '',
      slug: workspaceSlug,
      isDemo: isDemo,
    }, template);

    // create bot role
    const botUser = await this.customerService.createBotUser(workspace.id, workspace.slug, workspace.roles);

    try {
      const adminRole = workspace.roles.find((role) => role.type === RoleTypeEnum.ADMIN) as Role;
      await this.userOfCustomerPrismaAdapter.connectUserToWorkspace(
        workspace.id,
        adminRole?.id as string,
        userId as string
      );

      const dialogueData = await uploadedCsv;

      if (dialogueData) {
        let records = await parseCsv(dialogueData, { delimiter: ';' });
        await this.generateDialoguesByCSVRecords(
          workspace,
          type,
          template,
          records,
          userId,
          input.generateDemoData || undefined,
          makeDialoguesPrivate || undefined,
        )
      } else {
        await this.generateDialoguesByTemplateLayers(
          workspace,
          type,
          undefined,
          input.generateDemoData || undefined,
          makeDialoguesPrivate || undefined
        );
      }

      if (managerCsv) await this.addManagersToWorkspace(managerCsv, workspace);

      try {
        await this.createBotUser(workspace);
      } catch (error) {
        throw new GraphQLYogaError('Something went wrong creating bot account.');
      }

      return workspace;
    } catch (error) {
      await this.userOfCustomerPrismaAdapter.delete(botUser.userId, workspace.id).catch((err) => logger.error('Failed removing bot using', err));
      await this.customerService.deleteWorkspace(workspace.id);
      throw new GraphQLYogaError('Something went wrong generating generating workspace. All changes have been reverted');
    }
  };

};

export default GenerateWorkspaceService;
