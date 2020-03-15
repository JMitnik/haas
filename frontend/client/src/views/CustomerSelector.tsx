import React from 'react';
import styled, { css } from 'styled-components';
import Select, { ActionMeta } from 'react-select';
import { useHistory } from 'react-router-dom';

import { H1, Div, Card, CardBody, CardFooter, H3, Flex, ColumnFlex, Label } from '@haas/ui';


export const CustomerSelector = ({ customers }: { customers: any }) => {

    return (
      <CenteredScreen>
        <Div useFlex flexDirection='column' justifyContent='space-between' height='80vh'>
            <H1 textAlign="center" color="white">Welcome to haas</H1>

            {customers.map((customer: any, index: number) => {
                return <CustomerCard key={index} customer={customer} ></CustomerCard>
            })}
        </Div>
      </CenteredScreen>
    )
};


const CustomerCard = ({ customer }: { customer: any }) => {
  const questionnaireOptions = customer?.questionnaires.map((questionnaire: any) => ({ value: questionnaire.id, label: questionnaire.title }));
  const history = useHistory();

  const startQuestionnaire = (questionnaireOption: any, actionMeta: ActionMeta) => {
    if (actionMeta.action === 'select-option') {
      history.push(`/c/${customer.id}/q/${questionnaireOption.value}`);
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
          <Select options={questionnaireOptions} onChange={(qOption, actionMeta) => startQuestionnaire(qOption, actionMeta)}></Select>
        </Div>
      </CardFooter>
    </Card>
  );
};

const CustomerCardImage = styled.img`
  width: 75px;
  height: 75px;
`;

const CustomerCardEnqueteLabel = styled(Label)`
  ${({ theme }) => css`
    text-transform: uppercase;
    color: ${theme.colors.default.muted};
    background: ${theme.colors.default.normal};
    font-size: 12px;

    font-weight: 1000;
    position: absolute;
    top: ${theme.gutter / 2}px;
    right: ${theme.gutter / 2}px;
  `}
`;

const CenteredScreen = styled(Div)`
  ${({ theme }) => css`
    max-width: 780px;
    margin: 0 auto;
    position: relative;
    padding-top: 100px;

    @media ${theme.media.mob} {
      padding-top: 0;
      margin: 0 ${theme.gutter}px;
    }
  `}
`;
