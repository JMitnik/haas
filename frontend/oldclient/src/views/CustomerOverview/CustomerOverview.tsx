import React, { useEffect } from 'react';

import { Div, H1, Text } from '@haas/ui';
import { motion } from 'framer-motion';
import Logo from 'components/Logo';
import useDialogueTree from 'providers/DialogueTreeProvider';

import { CustomerOverviewContainer } from './CustomerOverviewStyles';

const CustomerOverview = () => {
  const { store } = useDialogueTree();

  useEffect(() => {
    if (store.customer) {
      store.resetProject();
    }
  }, [store.customer, store.resetProject, store]);

  return (
    <CustomerOverviewContainer exit={{ opacity: 0 }}>
      <Div alignItems="center" useFlex flexDirection="column" justifyContent="center" minHeight="80vh">
        <motion.div initial={{ y: 60, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
          <Div useFlex mb={2} alignItems="flex-end" justifyContent="center">
            <Logo width={150} />
            <H1 mb={0} fontSize={[40, 100]} textAlign="center" color="white" ml={4}>
              haas
            </H1>
          </Div>
          <motion.div initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1, transition: { delay: 0.7 } }}>
            <Div justifyContent="center" color="white" display="flex">
              <Text fontSize="1.7rem" mr={1}>
                happiness
              </Text>
              <motion.span initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1, transition: { delay: 1.2 } }}>
                <Text fontSize="1.7rem">
                  as a service
                </Text>
              </motion.span>
            </Div>
          </motion.div>
        </motion.div>
      </Div>
    </CustomerOverviewContainer>
  );
};

export default CustomerOverview;
