import { PrismaClient, RoleTypeEnum } from '@prisma/client';
import { ApolloError } from 'apollo-server-express';
import { NexusGenInputs } from '../../generated/nexus';
import { parseCsv } from '../../utils/parseCsv';
import { CustomerPrismaAdapter } from '../customer/CustomerPrismaAdapter';
import DialoguePrismaAdapter from '../questionnaire/DialoguePrismaAdapter';
import { CreateDialogueInput } from '../questionnaire/DialoguePrismaAdapterType';
import NodeService from '../QuestionNode/NodeService';
import { defaultMassSeedTemplate } from '../templates/defaultWorkspaceTemplate';
import UserOfCustomerPrismaAdapter from '../users/UserOfCustomerPrismaAdapter';

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

  /**
   * Generates a workspace based on the content of a CSV
   * @param input 
   * @returns the created workspace
   */
  async generateWorkspaceFromCSV(input: NexusGenInputs['GenerateWorkspaceCSVInputType']) {
    const { uploadedCsv, workspaceSlug, workspaceTitle, type } = input;
    const records = await parseCsv(await uploadedCsv, { delimiter: ',' });

    // Create customer 
    // TODO: Allow for adjustment of template roles
    const workspace = await this.customerPrismaAdapter.createWorkspace({
      name: workspaceTitle,
      primaryColour: '#7266EE',
      logo: '',
      slug: workspaceSlug,
    });

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
