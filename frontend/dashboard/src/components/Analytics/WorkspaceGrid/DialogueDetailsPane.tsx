import * as UI from '@haas/ui';
import { motion } from 'framer-motion';
import { useFormatter } from 'hooks/useFormatter';
import { useTranslation } from 'react-i18next';
import React from 'react';

import * as LS from './WorkspaceGrid.styles';
import { Dialogue } from './WorkspaceGrid.types';

interface DialogueDetailsPaneProps {
  dialogue: Dialogue;
}

export const DialogueDetailsPane = ({ dialogue }: DialogueDetailsPaneProps) => {
  const { formatScore } = useFormatter();
  const { t } = useTranslation();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <LS.DetailsPane
        animate={{ opacity: 1, y: 0 }}
        initial={{ opacity: 0, y: 20 }}
        m={4}
      >
        <UI.Text fontSize="1.1rem" color="blue.800" fontWeight={600}>
          Insights
        </UI.Text>
        <UI.Muted fontWeight={800} style={{ fontWeight: 500 }}>
          Understand your flow and how it impacts your conversations.
        </UI.Muted>

        <UI.Div mt={4}>
          <UI.Helper>{t('dialogue')}</UI.Helper>
          <UI.Span fontWeight={500}>
            {dialogue.title}
          </UI.Span>
        </UI.Div>

        <UI.Div mt={4}>
          <UI.Helper>{t('statistics')}</UI.Helper>
          <UI.Div mt={1}>
            <UI.Icon stroke="#7a228a" mr={1}>
              {/* <PieChart /> */}
            </UI.Icon>
            {formatScore(dialogue.dialogueStatisticsSummary?.impactScore || undefined)}
          </UI.Div>

          <UI.Div mt={1}>
            <UI.Span fontWeight={500}>
              <UI.Icon stroke="#f1368a" mr={1}>
                {/* <Users /> */}
              </UI.Icon>
              {dialogue.dialogueStatisticsSummary?.nrVotes}
            </UI.Span>
          </UI.Div>
        </UI.Div>
      </LS.DetailsPane>
    </motion.div>
  );
};
