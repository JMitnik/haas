import React from 'react';
import { Div, Card, CardBody, CardFooter, H3, Flex, ColumnFlex } from '@haas/ui';
import Select, { ActionMeta } from 'react-select';
import { useHistory } from 'react-router-dom';
import { CustomerCardImage, CustomerCardEnqueteLabel } from './CustomerCardStyles';

const CustomerCard = ({ customer }: { customer: any }) => {
  const questionnaireOptions = customer?.questionnaires?.map((questionnaire: any) => ({
    value: questionnaire.id,
    label: questionnaire.title
  }));

  const history = useHistory();

  const startQuestionnaire = (questionnaireOption: any, actionMeta: ActionMeta) => {
    if (actionMeta.action === 'select-option') {
      history.push(`/${customer.slug}/${questionnaireOption.value}`);
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
            {customer?.questionnaires ? customer?.questionnaires.length : 'No'} questionnaires
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
