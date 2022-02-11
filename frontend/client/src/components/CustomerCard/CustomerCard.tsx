import { CardBody, CardFooter, ColumnFlex, Div, Flex, H3 } from '@haas/ui';
import { useHistory } from 'react-router-dom';
import React from 'react';
import Select from 'react-select';
import styled, { css } from 'styled-components';

import { CustomerCardEnqueteLabel, CustomerCardImage } from './CustomerCardStyles';

// TODO: Reconcile with regular Card
const Card = styled(Div)`
  ${({ theme }) => css`
      position: relative;
      border-radius: ${theme.borderRadiuses.md};
      background: ${theme.colors.white};
      color: ${theme.colors.default.darkest};
      cursor: pointer;
      transition: all .3s cubic-bezier(.55,0,.1,1);
  `}
`;

const CustomerCard = ({ customer }: { customer: any }) => {
  const questionnaireOptions = customer?.dialogues?.map((dialogue: any) => ({
    value: dialogue.slug,
    label: dialogue.title,
  }));

  const history = useHistory();

  const startQuestionnaire = (dialogueOption: any, actionMeta: any) => {
    if (actionMeta.action === 'select-option') {
      history.push(`/${customer.slug}/${dialogueOption.value}`);
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
            {customer?.dialogues ? customer?.dialogues.length : 'No'}
            {' '}
            {customer?.dialogues?.length === 1 ? 'dialogue' : 'dialogues'}
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