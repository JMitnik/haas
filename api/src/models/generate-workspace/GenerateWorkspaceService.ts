import { Customer, PrismaClient, Role, RoleTypeEnum } from '@prisma/client';
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
import { subDays } from 'date-fns';
import SessionPrismaAdapter from '../session/SessionPrismaAdapter';
import DialogueService from '../questionnaire/DialogueService';

class GenerateWorkspaceService {
  customerPrismaAdapter: CustomerPrismaAdapter;
  dialoguePrismaAdapter: DialoguePrismaAdapter;
  nodeService: NodeService;
  userOfCustomerPrismaAdapter: UserOfCustomerPrismaAdapter;
  sessionPrismaAdapter: SessionPrismaAdapter;
  templateService: TemplateService;
  dialogueService: DialogueService;

  constructor(prismaClient: PrismaClient) {
    this.customerPrismaAdapter = new CustomerPrismaAdapter(prismaClient);
    this.dialoguePrismaAdapter = new DialoguePrismaAdapter(prismaClient);
    this.nodeService = new NodeService(prismaClient);
    this.userOfCustomerPrismaAdapter = new UserOfCustomerPrismaAdapter(prismaClient);
    this.sessionPrismaAdapter = new SessionPrismaAdapter(prismaClient);
    this.templateService = new TemplateService(prismaClient);
    this.dialogueService = new DialogueService(prismaClient);
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
    const adminRole = workspace.roles.find((role) => role.type === RoleTypeEnum.ADMIN);
    await this.userOfCustomerPrismaAdapter.connectUserToWorkspace(
      workspace.id,
      adminRole?.id as string,
      userId as string
    );

    const template = this.getTemplate(templateType);
    const uniqueDialogues: string[][] = cartesian(template.rootLayer, template.subLayer, template.subSubLayer);
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

    // Extreme case
    // const currentDate = new Date();
    // const yesterdayDate = subDays(currentDate, 1);
    // const dialogueSlug = mappedDialogueInputData?.[0]?.slug;
    // const dialogueWithNodes = await this.dialoguePrismaAdapter.getFullDialogueBySlug(dialogueSlug, workspace.id);

    // if (dialogueWithNodes) {
    //   await this.dialoguePrismaAdapter.setGeneratedWithGenData(dialogueWithNodes?.id, true);
    //   const rootNode = dialogueWithNodes?.questions.find((node) => node.isRoot);
    //   const edgesOfRootNode = dialogueWithNodes?.edges.filter((edge) => edge.parentNodeId === rootNode?.id);

    //   // Stop if no rootnode
    //   if (!rootNode) throw new ApolloError(`No root node found for ${dialogueWithNodes.slug}. Abort.`);

    //   const simulatedRootVote: number = 13;
    //   const simulatedChoice = template.topics[0]; // Physical & Mental
    //   const simulatedChoiceEdge = edgesOfRootNode?.find((edge) => edge.conditions.every((condition) => {
    //     if ((!condition.renderMin && !(condition.renderMin === 0)) || !condition.renderMax) return false;
    //     const isValid = condition?.renderMin < simulatedRootVote && condition?.renderMax > simulatedRootVote;
    //     return isValid;
    //   }));

    //   const simulatedChoiceNodeId = simulatedChoiceEdge?.childNode.id;

    //   if (!simulatedChoiceNodeId) throw new ApolloError('No edge found for selected option. Please contact an admin.');

    //   const fakeSessionInputArgs: (
    //     {
    //       createdAt: Date;
    //       dialogueId: string;
    //       rootNodeId: string;
    //       simulatedRootVote: number;
    //       simulatedChoiceNodeId: string;
    //       simulatedChoiceEdgeId?: string;
    //       simulatedChoice: string;
    //     }) = {
    //     dialogueId: dialogueWithNodes.id,
    //     createdAt: yesterdayDate,
    //     rootNodeId: rootNode.id,
    //     simulatedRootVote,
    //     simulatedChoiceNodeId,
    //     simulatedChoiceEdgeId: simulatedChoiceEdge?.id,
    //     simulatedChoice,
    //   }
    //   const emergencySession = await this.sessionPrismaAdapter.createFakeSession(fakeSessionInputArgs);
    //   // TODO: Get correct node ID maybe 🤔 maybe not necessary for form CTA 
    //   const formCTAData = {
    //     'sessionId': emergencySession.id,
    //     'nodeId': 'cl2fygcnb1182bgoikg4nozz0',
    //     'data': {
    //       'form': {
    //         'values': [
    //           {
    //             'relatedFieldId': 'cl2fygcnb1184bgoiv637jja0',
    //             'shortText': 'Daan',
    //           },
    //           {
    //             'relatedFieldId': 'cl2fygcnb1185bgoi9rcr308t',
    //             'shortText': 'Helsloot',
    //           },
    //           {
    //             'relatedFieldId': 'cl2fygcnb1186bgoi50v2t3mv',
    //             'email': 'daan.998@hotmail.com',
    //           },
    //         ],
    //       },
    //     },
    //   }


    // }


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
      const leafs = await this.templateService.createTemplateLeafNodes(type as NexusGenEnums['DialogueTemplateType'], dialogue.id);

      // Make nodes
      await this.templateService.createTemplateNodes(dialogue.id, workspace.name, leafs, type as string);


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
