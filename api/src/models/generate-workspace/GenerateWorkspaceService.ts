import { Customer, Prisma, PrismaClient, Role, RoleTypeEnum } from '@prisma/client';
import { ApolloError } from 'apollo-server-express';

import templates from '../templates';
import TemplateService from '../templates/TemplateService';
import { NexusGenEnums, NexusGenInputs } from '../../generated/nexus';
import { parseCsv } from '../../utils/parseCsv';
import { CustomerPrismaAdapter } from '../customer/CustomerPrismaAdapter';
import DialoguePrismaAdapter from '../questionnaire/DialoguePrismaAdapter';
import { CreateDialogueInput } from '../questionnaire/DialoguePrismaAdapterType';
import NodeService from '../QuestionNode/NodeService';
import UserOfCustomerPrismaAdapter from '../users/UserOfCustomerPrismaAdapter';
import { cartesian } from './DemoHelpers';
import SessionPrismaAdapter from '../session/SessionPrismaAdapter';
import DialogueService from '../questionnaire/DialogueService';
import { DemoWorkspaceTemplate } from '../templates/TemplateTypes';
import { DialogueTemplateType } from '../QuestionNode/NodeServiceType';
import UserService from '../../models/users/UserService';
import { GenerateWorkspaceCSVInput, Workspace } from './GenerateWorkspace.types';

class GenerateWorkspaceService {
  customerPrismaAdapter: CustomerPrismaAdapter;
  dialoguePrismaAdapter: DialoguePrismaAdapter;
  nodeService: NodeService;
  userOfCustomerPrismaAdapter: UserOfCustomerPrismaAdapter;
  sessionPrismaAdapter: SessionPrismaAdapter;
  templateService: TemplateService;
  dialogueService: DialogueService;
  userService: UserService;

  constructor(prismaClient: PrismaClient) {
    this.customerPrismaAdapter = new CustomerPrismaAdapter(prismaClient);
    this.dialoguePrismaAdapter = new DialoguePrismaAdapter(prismaClient);
    this.nodeService = new NodeService(prismaClient);
    this.userOfCustomerPrismaAdapter = new UserOfCustomerPrismaAdapter(prismaClient);
    this.sessionPrismaAdapter = new SessionPrismaAdapter(prismaClient);
    this.templateService = new TemplateService(prismaClient);
    this.dialogueService = new DialogueService(prismaClient);
    this.userService = new UserService(prismaClient);
  };

  /**
   * Finds the correct template based a provided type
   * @param templateType
   * @returns
   */
  getTemplate(templateType: string): DemoWorkspaceTemplate {
    switch (templateType) {
      case DialogueTemplateType.BUSINESS_ENG:
        return templates.business;
      case DialogueTemplateType.SPORT_ENG:
        return templates.sportEng;
      case DialogueTemplateType.SPORT_NL:
        return templates.sportNl;
      case DialogueTemplateType.DEFAULT:
        return templates.default;
      default:
        return templates.default;
    }
  }

  /**
   * Generates demo data for a specific template
   * @param templateType
   * @param workspace
   * @param userId
   * @returns
   */
  async generateDemoData(
    templateType: string,
    workspace: Customer & {
      roles: Role[];
    },
    userId?: string,
    sessionsPerDay: number = 1,
    generateData: boolean = true,
  ) {
    const adminRole = workspace.roles.find((role) => role.type === RoleTypeEnum.ADMIN);
    await this.userOfCustomerPrismaAdapter.connectUserToWorkspace(
      workspace.id,
      adminRole?.id as string,
      userId as string
    );

    const template = this.getTemplate(templateType);
    const uniqueDialogues: string[][] = cartesian(template.rootLayer, template.subLayer, template.subSubLayer);

    const mappedDialogueInputData = uniqueDialogues.map(
      (dialogue: string[]) => {
        if (dialogue?.[0].length && dialogue?.[1].length) {
          return { slug: dialogue.join('-'), title: dialogue.join(' - ') };
        }
        return { slug: dialogue[0], title: dialogue[0] };
      });

    for (let i = 0; i < mappedDialogueInputData.length; i++) {
      const { slug, title } = mappedDialogueInputData[i];
      const template = this.templateService.findTemplate(templateType as NexusGenEnums['DialogueTemplateType']);

      const dialogueInput: CreateDialogueInput = {
        slug: slug,
        title: title,
        description: '',
        customer: { id: workspace.id, create: false },
        isPrivate: false,
        postLeafText: template?.postLeafText,
      };

      // Create initial dialogue
      const dialogue = await this.dialoguePrismaAdapter.createTemplate(dialogueInput);

      if (!dialogue) throw new ApolloError('ERROR: No dialogue created! aborting...');
      // Make post leaf node if data specified in template
      await this.templateService.createTemplatePostLeafNode(templateType as NexusGenEnums['DialogueTemplateType'], dialogue.id);

      // Make the leafs
      const leafs = await this.templateService.createTemplateLeafNodes(templateType as NexusGenEnums['DialogueTemplateType'], dialogue.id);

      // Make nodes
      await this.templateService.createTemplateNodes(dialogue.id, workspace.name, leafs, templateType);

      // Generate data
      if (generateData) {
        await this.dialogueService.massGenerateFakeData(dialogue.id, template, sessionsPerDay, true, 5, 70, 80);
      }
    }

    return null;
  }

  /**
   * Based on a top down user csv, upsert available users and assign all existing private dialogues to them
   * @param managerCsv 
   * @param workspace 
   */
  addManagersFromCSV = async (managerCsv: any, workspace: Workspace) => {
    let records = await parseCsv(await managerCsv, { delimiter: ';' });

    const managerRole = workspace.roles.find((role) => role.type === RoleTypeEnum.MANAGER) as Role;

    for (let i = 0; i < records.length; i++) {
      const record = records[i];
      const userEmailEntry = Object.entries(record).find((entry) => entry[0] === 'email');
      const userPhoneEntry = Object.entries(record).find((entry) => entry[0] === 'phone_number?');
      const userLastNameEntry = Object.entries(record).find((entry) => entry[0] === 'last_name?');
      const userFirstNameEntry = Object.entries(record).find((entry) => entry[0] === 'first_name?');

      const hasEmailAssignee = !!userEmailEntry?.[1];
      const emailAssignee = userEmailEntry?.[1] as string;
      const phoneAssignee = userPhoneEntry?.[1] as string | undefined;
      const firstNameAssignee = userFirstNameEntry?.[1] as string | undefined;
      const lastNameAssignee = userLastNameEntry?.[1] as string | undefined;

      if (!hasEmailAssignee || !emailAssignee || !managerRole) continue;

      const user = await this.userService.upsertUserByEmail({
        email: emailAssignee,
        phone: phoneAssignee,
        firstName: firstNameAssignee,
        lastName: lastNameAssignee,
      });

      const invitedUser = await this.userOfCustomerPrismaAdapter.upsertUserOfCustomer(
        workspace.id,
        user.id,
        managerRole.id,
      );

      await this.userService.connectPrivateDialoguesToUser(user.id, workspace.id);

      void this.userService.sendInvitationMail(invitedUser);
    }
  }

  /**
   * Generates a workspace based on the content of a CSV
   * @param input
   * @returns the created workspace
   */
  async generateWorkspaceFromCSV(input: GenerateWorkspaceCSVInput, userId?: string) {
    const { uploadedCsv, workspaceSlug, workspaceTitle, type, managerCsv } = input;

    const template = this.getTemplate(type);
    const workspace = await this.customerPrismaAdapter.createWorkspace({
      name: workspaceTitle,
      primaryColour: '',
      logo: '',
      slug: workspaceSlug,
    }, template);

    if (input.generateDemoData) return this.generateDemoData(type, workspace, userId);

    let records = await parseCsv(await uploadedCsv, { delimiter: ';' });

    const adminRole = workspace.roles.find((role) => role.type === RoleTypeEnum.ADMIN) as Role;
    await this.userOfCustomerPrismaAdapter.connectUserToWorkspace(
      workspace.id,
      adminRole?.id as string,
      userId as string
    );

    const startTime = performance.now();
    // For every record generate dialogue, users + assign to dialogue
    for (let i = 0; i < records.length; i++) {
      const record = records[i];
      const layers = Object.entries(record).filter((entry) => entry[0].includes('layer') && (entry[1] as string)?.length > 0);
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
        isPrivate: hasEmailAssignee,
        postLeafText: {
          header: template.postLeafText?.header,
          subHeader: template.postLeafText?.subHeader,
        },
      };

      // Create initial dialogue
      const dialogue = await this.dialoguePrismaAdapter.createTemplate(dialogueInput);

      if (!dialogue) throw new ApolloError('ERROR: No dialogue created! aborting...');
      // Make the leafs
      const leafs = await this.templateService.createTemplateLeafNodes(type as NexusGenEnums['DialogueTemplateType'], dialogue.id);

      // Make nodes
      await this.templateService.createTemplateNodes(dialogue.id, workspace.name, leafs, type as string);

      // Check if user already exists
      // If not create new user entry + userOfCustomer entry
      // If exists => connect existing user when creating new userOfCustomer entry
      if (!hasEmailAssignee || !emailAssignee || !userRole) continue;

      const user = await this.userOfCustomerPrismaAdapter.addUserToPrivateDialogue(
        emailAssignee,
        dialogue.id,
        phoneAssignee
      );

      const invitedUser = await this.userOfCustomerPrismaAdapter.upsertUserOfCustomer(
        workspace.id,
        user.id,
        user.id === userId ? adminRole?.id as string : userRole.id, // If user generating is upserted => give admin role
      );

      void this.userService.sendInvitationMail(invitedUser);
    };

    const endTime = performance.now();

    console.log(`Time to run generate workspace: ${endTime - startTime}ms`)

    if (managerCsv) await this.addManagersFromCSV(managerCsv, workspace);

    return workspace;
  };

};

export default GenerateWorkspaceService;
