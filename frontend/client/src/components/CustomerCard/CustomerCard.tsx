import React from 'react';
import { Div, Card, CardBody, CardFooter, H3, Flex, ColumnFlex } from '@haas/ui';
import Select, { ActionMeta } from 'react-select';
import { useHistory } from 'react-router-dom';
import { CustomerCardImage, CustomerCardEnqueteLabel } from './CustomerCardStyles';

const CustomerCard = ({ customer }: { customer: any }) => {
  const questionnaireOptions = customer?.dialogues?.map((dialogue: any) => ({
    value: dialogue.id,
    label: dialogue.title
  }));

  const history = useHistory();

  const startQuestionnaire = (dialogueOption: any, actionMeta: any) => {
    if (actionMeta.action === 'select-option') {
      history.push(`/dashboard/${customer.slug}/${dialogueOption.value}`);
    }
  };

  return (
    <Card useFlex flexDirection="column">
      <CardBody flex="100%">
        <Flex alignItems="center">
          <CustomerCardImage src={customer?.settings?.logoUrl} />
          <Div ml={4}>
            <ColumnFlex>
              <H3 fontWeight={500} textAlign="center">
                {customer.name}
              </H3>
            </ColumnFlex>
          </Div>
          <CustomerCardEnqueteLabel>
            {customer?.dialogues ? customer?.dialogues.length : 'No'} questionnaires
          </CustomerCardEnqueteLabel>
        </Flex>
      </CardBody>

      <CardFooter>
        <Div>
          <Select
            options={questionnaireOptions}
            onChange={(qOption, actionMeta) => startQuestionnaire(qOption, actionMeta)}
          />
        </Div>
      </CardFooter>
    </Card>
  );
};

export default CustomerCard;
