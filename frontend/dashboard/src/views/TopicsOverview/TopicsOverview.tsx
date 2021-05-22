import * as UI from '@haas/ui';
import { useNavigator } from 'hooks/useNavigator';
import { useCustomer } from 'providers/CustomerProvider';
import React, { useState } from 'react'
import { Plus } from 'react-feather';
import { useTranslation } from 'react-i18next';
import { useGetTopicsOfDialogueQuery } from 'types/generated-types';

import CreateTopicForm from './CreateTopicForm';

const TopicsOverview = () => {
  const [isOpenModal, setIsOpenModal] = useState<boolean>(false);
  const { t } = useTranslation();
  const { dialogueSlug } = useNavigator();
  const { activeCustomer } = useCustomer();

  // TODO: Query the backend
  const { data, loading } = useGetTopicsOfDialogueQuery({
    variables: {
      customerId: activeCustomer?.id || '',
      dialogueSlug
    }
  });

  const topics = data?.customer?.dialogue?.topics || [];

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
                <CreateTopicForm onCloseModal={() => setIsOpenModal(false)} />
              </UI.CardBody>
            </UI.Card>
          </UI.Modal>

          <UI.Div>
            {/* list.map means to transform every item in list to something else (like HTML) */}
            <UI.Div maxWidth="600px">
              <UI.Stack spacing={4}>
                {topics.map(topic => (
                  <UI.Card key={topic.id}>
                    <UI.CardBody>
                      <UI.Text>{topic.label}</UI.Text>
                    </UI.CardBody>
                  </UI.Card>
                ))}
              </UI.Stack>
            </UI.Div>
          </UI.Div>
        </UI.ViewContainer>
    </>
  );
}

export default TopicsOverview;
