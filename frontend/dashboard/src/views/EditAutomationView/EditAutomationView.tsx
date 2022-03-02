/* eslint-disable arrow-body-style */
import * as UI from '@haas/ui';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import React from 'react';

import {
  useCreateAutomationMutation,
} from 'types/generated-types';
import { useNavigator } from 'hooks/useNavigator';

import AutomationForm from '../AddAutomationView/AutomationForm';

const EditAutomationView = () => {
  const { goToAutomationOverview } = useNavigator();
  const { t } = useTranslation();

  const [createAutomation, { loading }] = useCreateAutomationMutation({
    onCompleted: (data) => {
      console.log('return data create automation mutation: ', data?.createAutomation?.label);
      goToAutomationOverview();
      // TODO: Go back to automations overview
    },
    onError: (e) => {
      console.log('Something went wrong: ', e.message);
    },
  });

  return (
    <>
      <UI.ViewHead>
        <UI.ViewTitle>{t('views:edit_automation_view')}</UI.ViewTitle>
      </UI.ViewHead>

      <UI.ViewBody>
        <motion.div initial={{ opacity: 0, y: 100 }} animate={{ opacity: 1, y: 0 }}>
          <AutomationForm onCreateAutomation={createAutomation} onCreateAutomationLoading={loading} />
        </motion.div>
      </UI.ViewBody>
    </>
  );
};

export default EditAutomationView;
