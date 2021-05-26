import { inputObjectType, objectType, unionType } from "@nexus/schema";
import { isDefinitionNode } from "graphql";
import { CampaignModel, CampaignScheduleEnum, CampaignVariantEdgeConditionEnumType, CampaignVariantEnum } from "./CampaignModel";

type Operation = 'Create' | 'Edit';

/**
 * Generate the GraphQL Input types for campaigns, based on whether it is edited
 * or created.
 * @param operation
 * @returns
 */
export const saveCampaignInputFactory = (operation: Operation) => {
  const CampaignVariantInputType = inputObjectType({
    name: `${operation}CampaignVariantInputType`,

    definition(t) {
      t.id('id', { required: operation === 'Edit' ? true: false });

      t.string('label');

      t.id('workspaceId', { required: true });
      t.id('dialogueId', { required: true });

      t.int('depth');
      t.string('body');
      t.float('weight', { required: false });
      t.string('subject', { required: false });

      t.field('scheduleType', { type: CampaignScheduleEnum, required: true });
      t.field('type', { type: CampaignVariantEnum, required: true });

      t.list.field('children', { type: CampaignVariantEdgeInputType })
    }
  });

  const CampaignInput = inputObjectType({
    name: `${operation}CampaignInputType`,

    definition(t) {
      t.id('id', { required: operation === 'Edit' ? true: false });
      t.string('label');
      t.id('workspaceId', { required: true });
      t.list.field('variants', { type: CampaignVariantInputType });
    }
  });

  const CampaignVariantEdgeInputType = inputObjectType({
    name: `${operation}CampaignVariantEdgeInputType`,

    definition(t) {
      t.field('parentVariant', { required: operation === 'Edit' ? true: false, type: CampaignVariantInputType });
      t.field('childVariant', { required: false, type: CampaignVariantInputType });
      t.field('condition', { type: CampaignVariantEdgeConditionEnumType });
    }
  });

  const CampaignOutputSuccessType = objectType({
    name: `${operation}CampaignSuccessType`,

    definition(t) {
      t.field('campaign', { type: CampaignModel });
    }
  });

  const CampaignOutputProblem = objectType({
    name: `${operation}CampaignProblemType`,

    definition(t) {
      t.string('problemMessage');
    }
  })

  const CampaignOutputType = unionType({
    name: `${operation}CampaignOutputType`,

    definition(t) {
      t.members(CampaignOutputSuccessType, CampaignOutputProblem);
      t.resolveType(t => {
        if (t.problemMessage) return `${operation}CampaignProblemType`;

        return `${operation}CampaignSuccessType`;
      })
    }
  })

  return {
    CampaignVariantInputType,
    CampaignInput,
    CampaignVariantEdgeInputType,
    CampaignOutputSuccessType,
    CampaignOutputProblem,
    CampaignOutputType
  }
};