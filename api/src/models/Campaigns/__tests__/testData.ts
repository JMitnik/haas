import { Prisma } from 'prisma/prisma-client';

export const SAMPLE_WORKSPACE: Prisma.CustomerCreateInput = {
  id: 'TEST_WORKSPACE',
  name: 'Test workspace',
  slug: 'test_workspace',
}

export const SAMPLE_DIALOGUE: Prisma.DialogueCreateInput = {
  id: 'TEST_DIALOGUE',
  customer: { connect: { id: SAMPLE_WORKSPACE.id } },
  description: '',
  slug: 'test_dialogue',
  title: 'Test Dialogue',
}

export const SAMPLE_CAMPAIGN_SIMPLE: Prisma.CampaignCreateInput = {
  id: 'TEST_CAMPAIGN',
  label: 'test',
  workspace: { connect: { id: SAMPLE_WORKSPACE.id } },
  variantsEdges: {
    create: [{
      weight: 50,
      campaignVariant: {
        create: {
          id: 'TEST_VARIANT_1',
          body: 'Dear {{ firstName }}, how are you?',
          dialogue: { connect: { id: SAMPLE_DIALOGUE.id } },
          label: 'Test Campaign',
          type: 'QUEUE',
          workspace: { connect: { id: SAMPLE_WORKSPACE.id } },
        }
      }
    }, {
      weight: 50,
      campaignVariant: {
        create: {
          id: 'TEST_VARIANT_2',
          body: 'Dear {{ firstName }}, how are you?',
          dialogue: { connect: { id: SAMPLE_DIALOGUE.id } },
          label: 'Test Campaign',
          type: 'QUEUE',
          workspace: { connect: { id: SAMPLE_WORKSPACE.id } },
        }
      }
    }]
  }
};

export const SAMPLE_CAMPAIGN_WITH_CUSTOM_VARIABLES: Prisma.CampaignCreateInput = {
  id: 'TEST_CAMPAIGN',
  label: 'test',
  workspace: { connect: { id: SAMPLE_WORKSPACE.id } },
  variantsEdges: {
    create: [{
      weight: 50,
      campaignVariant: {
        create: {
          id: 'TEST_VARIANT_1',
          body: 'Dear {{ firstName }}, how are you?',
          dialogue: { connect: { id: SAMPLE_DIALOGUE.id } },
          label: 'Test Campaign',
          type: 'QUEUE',
          workspace: { connect: { id: SAMPLE_WORKSPACE.id } },
        }
      }
    }, {
      weight: 50,
      campaignVariant: {
        create: {
          id: 'TEST_VARIANT_2',
          body: 'Dear {{ firstName }}, how are you?',
          dialogue: { connect: { id: SAMPLE_DIALOGUE.id } },
          label: 'Test Campaign',
          type: 'QUEUE',
          workspace: { connect: { id: SAMPLE_WORKSPACE.id } },
        }
      }
    }]
  }
};
