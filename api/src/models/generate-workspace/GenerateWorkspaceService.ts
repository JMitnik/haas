import { Customer, PrismaClient, Role, RoleTypeEnum } from '@prisma/client';
import { ApolloError } from 'apollo-server-express';
import templates from '../templates';
import { NexusGenInputs } from '../../generated/nexus';
import { parseCsv } from '../../utils/parseCsv';
import { CustomerPrismaAdapter } from '../customer/CustomerPrismaAdapter';
import DialoguePrismaAdapter from '../questionnaire/DialoguePrismaAdapter';
import { CreateDialogueInput } from '../questionnaire/DialoguePrismaAdapterType';
import NodeService from '../QuestionNode/NodeService';
import { defaultMassSeedTemplate } from '../templates/defaultWorkspaceTemplate';
import UserOfCustomerPrismaAdapter from '../users/UserOfCustomerPrismaAdapter';
import { cartesian } from './DemoHelpers';

class GenerateWorkspaceService {
  customerPrismaAdapter: CustomerPrismaAdapter;
  dialoguePrismaAdapter: DialoguePrismaAdapter;
  nodeService: NodeService;
  userOfCustomerPrismaAdapter: UserOfCustomerPrismaAdapter;

  constructor(prismaClient: PrismaClient) {
    this.customerPrismaAdapter = new CustomerPrismaAdapter(prismaClient);
    this.dialoguePrismaAdapter = new DialoguePrismaAdapter(prismaClient);
    this.nodeService = new NodeService(prismaClient);
    this.userOfCustomerPrismaAdapter = new UserOfCustomerPrismaAdapter(prismaClient);
  };


  getTemplate(templateType: string) {
    switch (templateType) {
      case 'BUSINESS':
        return templates.business;
      case 'SPORT_ENG':
        return templates.sportEng;
      case 'SPORT_NL':
        return templates.sportNl;
      // case 'DEFAULT':
      //   return templates.default;
      default:
        return templates.business; // TODO: Change to default when default template is mapped (if ever happens)
    }
  }


  async generateDemoData(
    templateType: string,
    workspace: Customer & {
      roles: Role[];
    },
    userId?: string) {
    const template = this.getTemplate(templateType);
    const uniqueDialogues = cartesian(template.rootLayer, template.subLayer, template.subSubLayer);

    const mappedDialogueInputData = uniqueDialogues.map(
      (dialogue: string[]) => ({ slug: dialogue.join('-'), title: dialogue.join(' - ') }));

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

      if (!dialogue) throw new ApolloError('ERROR: No dialogue created! aborting...');
      // Make the leafs
      const leafs = await this.nodeService.createTemplateLeafNodes(templateType, dialogue.id);

      // Make nodes
      await this.nodeService.createTemplateNodes(dialogue.id, workspace.name, leafs, templateType);
    }

    const adminRole = workspace.roles.find((role) => role.type === RoleTypeEnum.ADMIN);
    await this.userOfCustomerPrismaAdapter.connectUserToWorkspace(
      workspace.id,
      adminRole?.id as string,
      userId as string
    );
    return null;
  }

  /**
   * Generates a workspace based on the content of a CSV
   * @param input 
   * @returns the created workspace
   */
  async generateWorkspaceFromCSV(input: NexusGenInputs['GenerateWorkspaceCSVInputType'], userId?: string) {
    const { uploadedCsv, workspaceSlug, workspaceTitle, type } = input;
    // TODO: Allow for adjustment of template roles
    const template = this.getTemplate(type);
    const workspace = await this.customerPrismaAdapter.createWorkspace({
      name: workspaceTitle,
      primaryColour: '',
      logo: '',
      slug: workspaceSlug,
    }, template);

    if (input.generateDemoData) return this.generateDemoData(type, workspace, userId);
    const records = await parseCsv(await uploadedCsv, { delimiter: ',' });

    // Create customer 

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
      const leafs = await this.nodeService.createTemplateLeafNodes(defaultMassSeedTemplate.leafNodes, dialogue.id);

      // Make nodes
      await this.nodeService.createTemplateNodes(dialogue.id, workspace.name, leafs, type as string);


      // Check if user already exists
      // If not create new user entry + userOfCustomer entry
      // If exists => connect existing user when creating new userOfCustomer entry
      if (!hasEmailAssignee || !emailAssignee || !managerRole) continue;

      const user = await this.userOfCustomerPrismaAdapter.addUserToPrivateDialogue(
        emailAssignee,
        dialogue.id,
        phoneAssignee
      );

      await this.userOfCustomerPrismaAdapter.upsertUserOfCustomer(workspace.id, user.id, managerRole.id);
    };

    return workspace;
  };

};

export default GenerateWorkspaceService;
