import * as UI from '@haas/ui';
import React, { useState } from 'react'
import { Plus } from 'react-feather';
import { useTranslation } from 'react-i18next';

import CreateTopicForm from './CreateTopicForm';

const TopicsOverview = () => {
  const [isOpenModal, setIsOpenModal] = useState<boolean>(false);
  const { t } = useTranslation();

  return (
      <>
        <UI.ViewHeading>
          <UI.PageTitle>{t('views:topic_view')}</UI.PageTitle>
          <UI.Button
            onClick={() => setIsOpenModal(true)}
            leftIcon={Plus}
            size="sm"
            variantColor="teal"
          >
            {t('create_topic')}
          </UI.Button>
        </UI.ViewHeading>
        <UI.ViewContainer>
          <UI.Modal isOpen={isOpenModal} onClose={() => setIsOpenModal(false)}>
            <UI.Card bg="white" noHover width={700}>
              <UI.CardBody>
                <CreateTopicForm />
              </UI.CardBody>
            </UI.Card>
          </UI.Modal>
        </UI.ViewContainer>
    </>
  );
}

export default TopicsOverview;
