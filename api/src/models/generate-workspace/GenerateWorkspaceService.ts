import { Customer, PrismaClient, Role, RoleTypeEnum } from '@prisma/client';
import { ApolloError } from 'apollo-server-express';

import templates from '../templates';
import TemplateService from '../templates/TemplateService';
import { NexusGenEnums } from '../../generated/nexus';
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
import CustomerService from '../customer/CustomerService';
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
  customerService: CustomerService;
  userService: UserService;

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
    userId?: string) {
    const adminRole = workspace.roles.find((role) => role.type === RoleTypeEnum.ADMIN);
    await this.userOfCustomerPrismaAdapter.connectUserToWorkspace(
      workspace.id,
      adminRole?.id as string,
      userId as string
    );

    // create bot role
    await this.customerService.createBotUser(workspace.id, workspace.slug, workspace.roles);

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
      const dialogueInput: CreateDialogueInput = {
        slug: slug,
        title: title,
        description: '',
        customer: { id: workspace.id, create: false },
        isPrivate: false,
      };

      // Create initial dialogue
      const dialogue = await this.dialoguePrismaAdapter.createTemplate(dialogueInput);

      const template = this.templateService.findTemplate(templateType as NexusGenEnums['DialogueTemplateType']);

      if (!dialogue) throw new ApolloError('ERROR: No dialogue created! aborting...');
      // Make post leaf node if data specified in template
      await this.templateService.createTemplatePostLeafNode(templateType as NexusGenEnums['DialogueTemplateType'], dialogue.id);

      // Make the leafs
      const leafs = await this.templateService.createTemplateLeafNodes(templateType as NexusGenEnums['DialogueTemplateType'], dialogue.id);

      // Make nodes
      await this.templateService.createTemplateNodes(dialogue.id, workspace.name, leafs, templateType);

      // Generate data
      await this.dialogueService.massGenerateFakeData(dialogue.id, template, 1, true, 5, 70, 80);
    }

    return null;
  }

  /**
   * Parse an input CSV and generate dialogues / user structure based on each row.
   * @param input - A CSV following the appropriate spec
   * @param workspace - Created workspace to be matched
   * @param userId Id of user requesting the generate
   */
  private async parseInputCSV(input: GenerateWorkspaceCSVInput, workspace: Workspace, userId?: string) {
    const adminRole = workspace.roles.find((role) => role.type === RoleTypeEnum.ADMIN);

    let records = await parseCsv(await input.uploadedCsv, { delimiter: ',' });

    // If 'wrong' delimeter is used (;) => parse again based with that delimeter
    if (records.find((record: string | {}) => {
      return typeof record === 'object' && Object.keys(record).find((entry) => entry.includes(';'));
    })) {
      records = await parseCsv(await input.uploadedCsv, { delimiter: ';' });
    }

    // For every record generate dialogue, users + assign to dialogue
    for (let i = 0; i < records.length; i++) {
      const record = records[i];
      const layers = Object.entries(record).filter((entry) => entry[0].includes('layer'));
      const layersContent = layers.map((layer) => layer[1] as string);
      const dialogueSlug = layersContent.join('-');
      const dialogueTitle = `${layersContent.join(' - ')}`

      const userEmailEntry = Object.entries(record).find((entry) => entry[0] === 'emailAssignee');
      const userPhoneEntry = Object.entries(record).find((entry) => entry[0] === 'phoneAssignee');
      const hasEmailAssignee = !!userEmailEntry?.[1];
      const emailAssignee = userEmailEntry?.[1] as string;
      const phoneAssignee = userPhoneEntry?.[1] as string | undefined;
      const managerRole = workspace.roles.find((role) => role.type === RoleTypeEnum.MANAGER);

      const dialogueInput: CreateDialogueInput = {
        slug: dialogueSlug,
        title: dialogueTitle,
        description: '',
        customer: { id: workspace.id, create: false },
        isPrivate: hasEmailAssignee,
      };

      // Create initial dialogue
      const dialogue = await this.dialoguePrismaAdapter.createTemplate(dialogueInput);

      if (!dialogue) throw new ApolloError('ERROR: No dialogue created! aborting...');
      // Make the leafs
      const leafs = await this.templateService.createTemplateLeafNodes(input.type as NexusGenEnums['DialogueTemplateType'], dialogue.id);

      // Make nodes
      await this.templateService.createTemplateNodes(dialogue.id, workspace.name, leafs, input.type);

      // Check if user already exists
      // If not create new user entry + userOfCustomer entry
      // If exists => connect existing user when creating new userOfCustomer entry
      if (!hasEmailAssignee || !emailAssignee || !managerRole) continue;

      const user = await this.userOfCustomerPrismaAdapter.addUserToPrivateDialogue(
        emailAssignee,
        dialogue.id,
        phoneAssignee
      );

      const invitedUser = await this.userOfCustomerPrismaAdapter.upsertUserOfCustomer(
        workspace.id,
        user.id,
        user.id === userId ? adminRole?.id as string : managerRole.id, // If user generating is upserted => give admin role
      );

      void this.userService.sendInvitationMail(invitedUser);

    };
  }

  /**
   * Generates a workspace based on the content of a CSV or generate using prefilled data.
   * @param input
   * @returns the created workspace
   */
  async generateWorkspace(input: GenerateWorkspaceCSVInput, userId?: string) {
    // Get template based on workspace type, and generate the basic setup
    const template = this.getTemplate(input.type);
    const workspace = await this.customerPrismaAdapter.createWorkspace({
      name: input.workspaceTitle,
      primaryColour: '',
      logo: '',
      slug: input.workspaceSlug,
    }, template);

    // If we generate dialogues using demo data, do that and stop the rest of the flow
    if (input.generateDemoData) return this.generateDemoData(input.type, workspace, userId);

    // Else, continue by parsing the input CSV
    await this.parseInputCSV(input, workspace, userId);

    // Connect user to workspace as Admin
    const adminRole = workspace.roles.find((role) => role.type === RoleTypeEnum.ADMIN);
    await this.userOfCustomerPrismaAdapter.connectUserToWorkspace(
      workspace.id,
      adminRole?.id as string,
      userId as string
    );

    // Add bot user
    await this.customerService.createBotUser(workspace.id, workspace.slug, workspace.roles);

    return workspace;
  };
};

export default GenerateWorkspaceService;
