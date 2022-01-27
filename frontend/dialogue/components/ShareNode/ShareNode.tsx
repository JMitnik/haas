import * as UI from '@haas/ui';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useCallback, useRef } from 'react';
import { useClipboard } from 'use-clipboard-copy';
import { Share2 } from 'react-feather';
import chroma from 'chroma-js';
import { motion } from 'framer-motion';
import { AnimatePresence } from 'framer-motion';

import { QuestionNodeProps } from '../QuestionNode/QuestionNodeTypes';
import { QuestionNodeContainer, QuestionNodeTitle } from '../QuestionNode/QuestionNodeStyles';
import { useSession } from '../Session/SessionProvider';
import { SessionEventType } from '../../types/generated-types';
import { NodeLayout } from '../QuestionNode/NodeLayout';
import * as LS from './ShareNodeStyles';

const formatUrl = (url: string) => {
  if (url.startsWith('http')) return url;

  return `https://${url}`;
};

export const ShareNode = ({ node, onRunAction }: QuestionNodeProps) => {
  const { t } = useTranslation();
  const { sessionId } = useSession();

  const { copied, copy } = useClipboard({
    copiedTimeout: 1000,
  });

  const navi = window.navigator;

  const { share } = node;
  const handleCopy = async (): Promise<void> => {
    if (navi?.share) {
      // If Web Share API is supported
      await navi.share({
        text: `${share?.title} \n ${formatUrl(share?.url || '')}`,
      });
      window.location.reload();
    } else {
      const copiedText = `${share?.title} \n
        ${formatUrl(share?.url || '')}`;
      copy(copiedText);
    }
  };

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

  const color = chroma('#4f66ff').hex();

  const boxShadowVariants = [
    `${color} 0px 10px 15px -3px`,
    `${color} 0px 10px 15px 8px`,
    `${color} 0px 10px 15px -3px`,
  ];

  return (
    <NodeLayout node={node}>
      <QuestionNodeTitle>{node.title}</QuestionNodeTitle>

      <UI.Flex alignItems="center" justifyContent="center" style={{ flex: '100%' }}>
        <UI.Div style={{ position: 'relative' }}>
          <LS.ShareNodeButton
            // initial={{ boxShadow: boxShadowVarians }}
            onClick={() => handleCopy()}
            animate={{ boxShadow: boxShadowVariants }}
            transition={{ repeat: Infinity, duration: 6 }}
            >
              <UI.Span fontSize="2rem" fontWeight={100}>
                <UI.ColumnFlex alignItems="center">
                  <Share2 />
                  {share.tooltip}
                </UI.ColumnFlex>
              </UI.Span>
          </LS.ShareNodeButton>

          <AnimatePresence exitBeforeEnter={false}>
            {copied && (
              <motion.span
                style={{ position: 'absolute', left: '50%', transform: 'translateX(-50%)' }}
                animate={{ opacity: 1, bottom: -30 }}
                initial={{ opacity: 0, bottom: -80 }}
                exit={{ opacity: 0, bottom: -80 }}
              >
                {t('copied')}
              </motion.span>
            )}
          </AnimatePresence>
        </UI.Div>
      </UI.Flex>
    </NodeLayout>
  );
};
