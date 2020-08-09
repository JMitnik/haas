import { ErrorBoundary } from 'react-error-boundary';
import { Link } from 'react-router-dom';
import { Plus } from 'react-feather';
import { Variants, motion } from 'framer-motion';
import React from 'react';

import {
  AddCard, Container, Flex, Grid, H4, PageHeading,
} from '@haas/ui';
import { Skeleton } from '@chakra-ui/core';
import { TranslatedPlus } from 'views/DialogueOverview/DialogueOverviewStyles';
import SurveyIcon from 'components/Icons/SurveyIcon';

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

const CustomerOverview = ({ customers, isLoading }: { customers: any[], isLoading: boolean }) => (
  <CustomerOverviewContainer>
    <Container>
      <PageHeading>Projects</PageHeading>
      <H4 mb={2} color="gray.500">Current businesses</H4>
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
            {customers?.map((customer: any, index: any) => customer && (
              <motion.div style={{ height: '100%' }} key={index} variants={cardItemAnimation}>
                <ErrorBoundary key={index} FallbackComponent={() => (<></>)}>
                  <CustomerCard key={index} customer={customer} />
                </ErrorBoundary>
              </motion.div>
            ))}

            <AddCard>
              <Link to="/dashboard/b/add" />
              <Flex flexDirection="column" alignItems="center" justifyContent="center">
                <SurveyIcon />
                <TranslatedPlus>
                  <Plus strokeWidth="3px" />
                </TranslatedPlus>
                <H4 color="default.dark">
                  Create a customer
                </H4>
              </Flex>
            </AddCard>

          </>
        )}
      </MotionGrid>
    </Container>
  </CustomerOverviewContainer>
);

export default CustomerOverview;
