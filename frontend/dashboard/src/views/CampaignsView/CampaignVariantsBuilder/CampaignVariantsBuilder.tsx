import * as UI from '@haas/ui';
import { useState } from 'react'
import ReactFlow, {
  Background,
  BackgroundVariant,
  isNode,
} from 'react-flow-renderer';
import styled, { css } from 'styled-components';
// import dagre from 'dagre';
import CampaignVariantScheduleNode from './CampaignVariantScheduleNode';
import { clone } from 'lodash';
import { Controller, useForm } from 'react-hook-form';
import CampaignVariantMediumNode from './CampaignVariantMediumNode';
import { useEffect } from 'react';
import Select from 'react-select';
import { useTranslation } from 'react-i18next';

import { ReactComponent as DoubleChevronIcon } from 'assets/icons/icon-chevron-double.svg';

import CampaignVariantFollowupNode from './CampaignVariantFollowupNode';


// const dagreGraph = new dagre.graphlib.Graph();
// dagreGraph.setDefaultEdgeLabel(() => ({}));

const nodeWidth = 172;
const nodeHeight = 36;

const CampaignVariantsBuilderContainer = styled.div`
  ${({ theme }) => css`
    height: 500px;
  `}
`;


const CampaignVariantCardContainer = styled.div`
  ${({ theme }) => css`
    display: flex;
    flex-direction: column;
    position: absolute;
    background: white;
    z-index: 1000;
    width: 350px;
    right: 0;
    top: 0;
    bottom: 0;
    box-shadow: 0 2px 3px rgba(0, 0, 0, 0.075), 0 4px 24px rgba(0, 0, 0, 0.1);
  `}
`;

const CampaignVariantCard = ({ activeVariant, onUpdate, onClose }: { activeVariant: any, onUpdate: (variant: any) => void, onClose: () => void }) => {
  const [clonedVariant, setClonedVariant] = useState(() => clone(activeVariant));
  const form = useForm();

  const changeVariantName = (event: any) => {
    console.log(clonedVariant);
    setClonedVariant((variant: any) => ({
      ...variant,
      data: {
        ...variant.data,
        label: event?.target?.value || ''
      }
    }));
  };

  const handleUpdate = () => {
    const newVariant = {
      id: activeVariant.id,
      data: {
        ...form.getValues()
      }
    };
    onUpdate(newVariant);
  }

  const dialogues: any[] = [];
  const { t } = useTranslation();

  return (
    <CampaignVariantCardContainer>
      <UI.CardHeader>
        <UI.Flex justifyContent="space-between">
          <UI.Helper>Edit campaign-variant</UI.Helper>

          <UI.IconButton
            onClick={onClose}
            variant="outline"
            width="10px"
            height="10px"
            aria-label="Fold"
            icon={() => <DoubleChevronIcon width="10px" />}
          />
        </UI.Flex>
      </UI.CardHeader>
      <UI.CardBody>
        <UI.Stack spacing={4}>
          <UI.Input ref={form.register()} name="label" defaultValue={clonedVariant.data.label} />
          <UI.FormControl isRequired>
              <UI.FormLabel htmlFor={`dialogue`}>{t('dialogue')}</UI.FormLabel>
              <Controller
                name={`dialogue`}
                control={form.control}
                defaultValue={activeVariant.dialogue || null}
                render={({ value, onChange, onBlur }) => (
                  <Select
                    placeholder="Select a dialogue"
                    id={`dialogue`}
                    classNamePrefix="select"
                    className="select"
                    defaultOptions
                    options={dialogues}
                    value={value}
                    onChange={onChange}
                    onBlur={onBlur}
                  />
                )}
              />
          </UI.FormControl>

        </UI.Stack>
      </UI.CardBody>
      <UI.CardFooter>
        <UI.Button onClick={handleUpdate}>Save</UI.Button>
      </UI.CardFooter>
    </CampaignVariantCardContainer>
  )
}


const nodeTypes = {
  campaignVariantSchedule: CampaignVariantScheduleNode,
  mediumTarget: CampaignVariantMediumNode,
  followUp: CampaignVariantFollowupNode
}

export const CampaignVariantsBuilder = () => {
  // const dagreGraph = new dagre.graphlib.Graph();
  // dagreGraph.setDefaultEdgeLabel(() => ({}));
//   const [activeVariant, setActiveVariant] = useState<any>(null);
//   const [variants, setVariants] = useState([{
//     id: 'ELDER_ROOT',
//     data: { label: 'Campaign' },
//     sourcePosition: 'right',
//     type: 'input'
//   }, {
//     id: 'VARIANT_1',
//     data: { label: 'Campaign Variant AC' },
//     targetPosition: 'right',
//     type: 'campaignVariantSchedule',
//     sourcePosition: 'left',
//   }, {
//     id: 'VARIANT_2',
//     data: { label: 'Campaign Variant: Follow-up A' },
//     targetPosition: 'right',
//     type: 'followUp',
//     sourcePosition: 'left',
//   },
//   {
//     id: 'VARIANT_MEDIUM',
//     data: { label: 'SMS' },
//     type: 'mediumTarget',
//     sourcePosition: 'top'
//   },
//   {
//     id: 'VARIANT_MEDIUM_2',
//     data: { label: 'SMS' },
//     type: 'mediumTarget',
//     sourcePosition: 'top'
//   },
// ]);

//   const [variantEdges, setVariantEdges] = useState([{
//     id: 'GENERAL_ROUTE',
//     source: 'ELDER_ROOT',
//     target: 'VARIANT_1',
//     label: '100%',
//     animated: true
//   },
//   {
//     id: 'TEST_MEDIUM',
//     source: 'VARIANT_1',
//     target: 'VARIANT_MEDIUM',
//     sourceHandle: 'medium',
//     targetHandle: 'mediumTarget',
//     label: 'Sends via medium',
//     animated: false
//   },
//   {
//     id: 'TEST_FOLLOW',
//     source: 'VARIANT_1',
//     target: 'VARIANT_2',
//     label: 'Follow-up if not opened in days',
//     animated: false
//   },
//   {
//     id: 'TESTFOLLOW',
//     source: 'VARIANT_2',
//     target: 'VARIANT_MEDIUM_2',
//     label: 'Send via medium',
//     animated: false
//   },
//   ]);

//   const [elements, setElements] = useState([]);

//   const getLayoutElements = () => {
//     variants.forEach((variant: any) => {
//       dagreGraph.setNode(variant?.id || '', { width: 150, height: 80 });
//     });

//     dagreGraph.setGraph({ rankdir: "LR", edgesep: 120, nodesep: 150, ranksep: 150 });

//     variantEdges.forEach((variantEdge: any) => {
//       dagreGraph.setEdge((variantEdge?.source || ''), variantEdge.target || '');
//     });

//     dagre.layout(dagreGraph);

//     return [...variants, ...variantEdges].map((el) => {
//       // @ts-ignore
//       if (isNode(el)) {
//         const nodeWithPosition = dagreGraph.node(el.id);
//         // unfortunately we need this little hack to pass a slighltiy different position
//         // in order to notify react flow about the change
//         el.position = {
//           x: nodeWithPosition.x + Math.random() / 1000,
//           y: nodeWithPosition.y
//         };
//       }
//       return el;
//     });
//   };

//   const updateCampaignVariant = (campaignVariant: any) => {
//     setVariants((variants) => variants.map(variant => {
//       if (variant.id === campaignVariant.id) {
//         variant.data = {
//           ...variant.data,
//           ...campaignVariant.data
//         }
//       }

//       return variant;
//     }));

//     setActiveVariant(null);
//   }

//   const closePanel = () => setActiveVariant(null);

//   useEffect(() => {
//     let els = getLayoutElements() as any || [];
//     setElements(els);
//   }, [variants]);

  return (
    <>
      <div>test</div>
    </>
  )
}

export default CampaignVariantsBuilder
