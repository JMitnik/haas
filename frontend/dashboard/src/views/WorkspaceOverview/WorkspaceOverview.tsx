import * as UI from '@haas/ui';
import { ErrorBoundary } from 'react-error-boundary';
import { Link } from 'react-router-dom';
import { Plus } from 'react-feather';
import { Skeleton } from '@chakra-ui/core';
import { TranslatedPlus } from 'views/DialogueOverview/DialogueOverviewStyles';
import { Variants, motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import React from 'react';

import { useNavigator } from 'hooks/useNavigator';
import SurveyIcon from 'components/Icons/SurveyIcon';
import useAuth from 'hooks/useAuth';

import * as LS from './WorkspaceOverview.styles';
import WorkspaceCard from './WorkspaceCard';

const cardContainerAnimation: Variants = {
  initial: {
    opacity: 0,
  },
  animate: {
    opacity: 1,
    transition: {
      staggerChildren: 0.03,
    },
  },
};

const cardItemAnimation: Variants = {
  initial: {
    opacity: 0,
    y: 100,
  },
  animate: {
    opacity: 1,
    y: 0,
  },
};

const MotionGrid = motion.custom(UI.Grid);

export const WorkspaceOverview = ({ customers, isLoading }: { customers: any[]; isLoading: boolean }) => {
  const { t } = useTranslation();
  const { canCreateCustomers, canAccessAdmin, canGenerateWorkspaceFromCsv } = useAuth();
  const { goToGenerateWorkspaceOverview } = useNavigator();

  return (
    <LS.WorkspaceOverviewContainer>
      <UI.ViewHead>
        <UI.Container>
          <UI.Flex alignItems="flex-end">
            <UI.Div>
              <UI.ViewTitle>
                {t('workspaces')}
              </UI.ViewTitle>
              <UI.ViewSubTitle>
                {t('workspaces_subtitle')}
              </UI.ViewSubTitle>
            </UI.Div>

            <UI.Div ml={4}>
              {canGenerateWorkspaceFromCsv && (
                <UI.Button size="sm" onClick={() => goToGenerateWorkspaceOverview()}>
                  {t('generate_workspace')}
                </UI.Button>
              )}
            </UI.Div>
          </UI.Flex>
        </UI.Container>
      </UI.ViewHead>
      <UI.ViewBody>
        <UI.Container>
          {isLoading ? (
            <MotionGrid
              gridGap={4}
              gridTemplateColumns={['1fr', 'repeat(auto-fill, minmax(300px, 1fr))']}
              gridAutoRows="minmax(200px, 1fr)"
              variants={cardContainerAnimation}
              animate="animate"
              initial="initial"
            >
              <Skeleton />
              <Skeleton />
              <Skeleton />
            </MotionGrid>
          ) : (
            <MotionGrid
              gridGap={4}
              gridTemplateColumns={['1fr', 'repeat(auto-fill, minmax(300px, 1fr))']}
              gridAutoRows="minmax(200px, 1fr)"
              variants={cardContainerAnimation}
              animate="animate"
              initial="initial"
            >
              {customers?.map((customer: any, index: any) => customer && (
                <motion.div
                  animate="animate"
                  initial="initial"
                  style={{ height: '100%' }}
                  key={index}
                  variants={cardItemAnimation}
                >
                  <ErrorBoundary key={index} FallbackComponent={() => <></>}>
                    <WorkspaceCard key={index} customer={customer} />
                  </ErrorBoundary>
                </motion.div>
              ))}

              {(canCreateCustomers || canAccessAdmin) && (
                <UI.AddCard>
                  <Link to="/dashboard/b/add" />
                  <UI.Flex flexDirection="column" alignItems="center" justifyContent="center">
                    <SurveyIcon />
                    <TranslatedPlus>
                      <Plus strokeWidth="3px" />
                    </TranslatedPlus>
                    <UI.H4 color="default.dark">{t('customer:create_customer')}</UI.H4>
                  </UI.Flex>
                </UI.AddCard>
              )}
            </MotionGrid>
          )}
        </UI.Container>
      </UI.ViewBody>
    </LS.WorkspaceOverviewContainer>
  );
};
