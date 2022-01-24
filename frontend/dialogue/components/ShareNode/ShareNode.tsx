import * as UI from '@haas/ui';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useCallback, useRef } from 'react';

import { Share2 } from 'react-feather';
import { QuestionNodeProps } from '../QuestionNode/QuestionNodeTypes';
import { QuestionNodeContainer, QuestionNodeTitle } from '../QuestionNode/QuestionNodeStyles';
import { useSession } from '../Session/SessionProvider';
import { SessionEventType } from '../../types/generated-types';
import { NodeLayout } from '../QuestionNode/NodeLayout';
import { findSliderChildEdge } from './findSliderChildEdge';
import { SliderBunny } from './SliderBunny';
import * as LS from './ShareNodeStyles';
import chroma from 'chroma-js';

const makeBoxShadowVariants = (color) => {
  return [
    `${color} 0px 10px 15px -3px, ${color} 0px 0px 4px 6px -2px, ${color} 0px 10px 15px -3px, ${color} 0px 4px 6px -2px`,
    `${color} 0px 10px 15px -2px, ${color} 0px 0px 4px 6px -1px, ${color} 0px 10px 15px -2px, ${color} 0px 4px 6px -1px`,
    `${color} 0px 10px 15px 0px, ${color} 0px 0px 4px 6px 0px, ${color} 0px 10px 15px 0px, ${color} 0px 4px 6px -0px`,
  ];
};

export const ShareNode = ({ node, onRunAction }: QuestionNodeProps) => {
  const { t } = useTranslation();
  const { sessionId } = useSession();

  /**
   * Handles a sliding action: find child and pass that child to par
   */
  const handleRunAction = useCallback(() => {

    // onRunAction({
    //   event: {
    //     sessionId,
    //     toNodeId: nextNodeId,
    //     eventType: SessionEventType.SliderAction,
    //     sliderValue: {
    //       relatedNodeId: node.id,
    //       value: sliderValue,
    //       timeSpent: new Date().getTime() - startTime.current.getTime(),
    //     },
    //     timestamp: new Date(),
    //   },
    //   activeCallToAction: node.overrideLeaf,
    // })
  }, []);

  var color = chroma('#4f66ff').hex();

  const boxShadowVarians = [
    `${color} 0px 10px 15px -3px`,
    `${color} 0px 10px 15px 8px`,
    `${color} 0px 10px 15px -3px`,
  ];

  return (
    <NodeLayout node={node}>
      <QuestionNodeTitle>{node.title}</QuestionNodeTitle>

      <UI.Flex alignItems="center" justifyContent="center" style={{ flex: '100%' }}>
        <LS.ShareNodeButton
          // initial={{ boxShadow: boxShadowVarians }}
          animate={{ boxShadow: boxShadowVarians }}
          transition={{ repeat: Infinity, duration: 6 }}
          >
            <UI.Span>
              <Share2 />
            </UI.Span>
        </LS.ShareNodeButton>
      </UI.Flex>
    </NodeLayout>
  );
};
