import * as UI from '@haas/ui';
import { Plus } from 'react-feather';
import { TopicModel, useGetTopicsOfDialogueQuery } from 'types/generated-types';
import { useCustomer } from 'providers/CustomerProvider';
import { useNavigator } from 'hooks/useNavigator';
import { useTranslation } from 'react-i18next';
import React, { useState } from 'react';

import CreateTopicForm from './CreateTopicForm';
import EditTopicForm from './EditTopicForm';

const TopicsOverview = () => {
  const { t } = useTranslation();
  const { dialogueSlug } = useNavigator();
  const { activeCustomer } = useCustomer();

  const [activeTopic, setActiveTopic] = useState<TopicModel | undefined>(undefined);
  const [isOpenModal, setIsOpenModal] = useState<boolean>(false);

  // TODO: Query the backend
  const { data } = useGetTopicsOfDialogueQuery({
    variables: {
      customerId: activeCustomer?.id || '',
      dialogueSlug,
    },
  });

  const topics = data?.customer?.dialogue?.topics || [];

  return (
    <>
      <UI.ViewHead>
        <UI.ViewTitle>{t('views:topic_view')}</UI.ViewTitle>
        <UI.Button
          onClick={() => setIsOpenModal(true)}
          leftIcon={Plus}
          size="sm"
          variantColor="teal"
        >
          {t('create_topic')}
        </UI.Button>
      </UI.ViewHead>
      <UI.ViewBody>

        {/* Modal (isOpenModal): Popup for creating a topic */}
        <UI.Modal isOpen={isOpenModal} onClose={() => setIsOpenModal(false)}>
          <UI.Card bg="white" noHover width={700}>
            <UI.CardBody>
              <CreateTopicForm onCloseModal={() => setIsOpenModal(false)} />
            </UI.CardBody>
          </UI.Card>
        </UI.Modal>

        {/* Modal (isOpenEditModal): Popup for editing a topic */}
        <UI.Modal isOpen={!!activeTopic} onClose={() => setActiveTopic(undefined)}>
          <UI.Card bg="white" noHover width={700}>
            <UI.CardBody>
              {activeTopic && (
              <EditTopicForm topic={activeTopic} onCloseModal={() => setActiveTopic(undefined)} />
              )}
            </UI.CardBody>
          </UI.Card>
        </UI.Modal>

        <UI.Div>
          {/* list.map means to transform every item in list to something else (like HTML) */}
          <UI.Div maxWidth="600px">
            <UI.Stack spacing={4}>
              {topics.map((topic) => (
                <UI.Card key={topic.id} onClick={() => setActiveTopic(topic)}>
                  <UI.CardBody>
                    <UI.Text>{topic.label}</UI.Text>
                  </UI.CardBody>
                </UI.Card>
              ))}
            </UI.Stack>
          </UI.Div>
        </UI.Div>
      </UI.ViewBody>
    </>
  );
};

export default TopicsOverview;
