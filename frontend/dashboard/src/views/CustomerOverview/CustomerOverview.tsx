import * as UI from '@haas/ui';
import {
  AddCard,
  Container,
  Flex,
  Grid,
  H4,
  PageHeading,
  Span,
} from '@haas/ui';
import { ErrorBoundary } from 'react-error-boundary';
import { Link } from 'react-router-dom';
import { Plus } from 'react-feather';
import { Skeleton } from '@chakra-ui/core';
import { TranslatedPlus } from 'views/DialogueOverview/DialogueOverviewStyles';
import { Variants, motion } from 'framer-motion';
import { useHistory } from 'react-router';
import { useTranslation } from 'react-i18next';
import React from 'react';

import SurveyIcon from 'components/Icons/SurveyIcon';
import useAuth from 'hooks/useAuth';

import { CustomerOverviewContainer } from './CustomerOverviewStyles';
import CustomerCard from './CustomerCard';

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

const MotionGrid = motion.custom(Grid);

const CustomerOverview = ({ customers, isLoading }: { customers: any[]; isLoading: boolean }) => {
  const { t } = useTranslation();
  const { canCreateCustomers, canAccessAdmin } = useAuth();
  const history = useHistory();
  const goToAdminPanel = () => {
    history.push('/dashboard/admin');
  };

  return (
    <CustomerOverviewContainer>
      <Container>
        <PageHeading>{t('projects')}</PageHeading>

        <Flex
          flexDirection="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <H4 mb={2} color="gray.500">
            {t('active_projects')}
          </H4>
          {canAccessAdmin && (
          <Span>
            <UI.Button bg="gray.200" mb={2} size="sm" variant="outline" onClick={goToAdminPanel}>
              <Link to="dashboard/">{t('adminpanel')}</Link>
            </UI.Button>
          </Span>
          )}
        </Flex>

        <MotionGrid
          gridGap={4}
          gridTemplateColumns={['1fr', 'repeat(auto-fill, minmax(300px, 1fr))']}
          gridAutoRows="minmax(200px, 1fr)"
          variants={cardContainerAnimation}
          animate="animate"
          initial="initial"
        >
          {isLoading ? (
            <>
              <Skeleton />
              <Skeleton />
              <Skeleton />
            </>
          ) : (
            <>
              {customers?.map(
                (customer: any, index: any) => customer && (
                <motion.div style={{ height: '100%' }} key={index} variants={cardItemAnimation}>
                  <ErrorBoundary key={index} FallbackComponent={() => <></>}>
                    <CustomerCard key={index} customer={customer} />
                  </ErrorBoundary>
                </motion.div>
                ),
              )}

              {canCreateCustomers && (
                <AddCard>
                  <Link to="/dashboard/b/add" />
                  <Flex flexDirection="column" alignItems="center" justifyContent="center">
                    <SurveyIcon />
                    <TranslatedPlus>
                      <Plus strokeWidth="3px" />
                    </TranslatedPlus>
                    <H4 color="default.dark">{t('customer:create_customer')}</H4>
                  </Flex>
                </AddCard>
              )}
            </>
          )}
        </MotionGrid>
      </Container>
    </CustomerOverviewContainer>
  );
};

export default CustomerOverview;
