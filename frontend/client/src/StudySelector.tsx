import React, { useCallback, useState } from 'react';
import { H1, Div, Card, CardBody, H3, Flex } from '@haas/ui';
import { useQuery } from '@apollo/react-hooks';
import { GET_SHALLOW_QUESTIONNAIRE_INFO } from './queries/getShallowQuestionnaireInfo'
export const StudySelector = ({ sendCurrentStudyToParent } : { sendCurrentStudyToParent: any }) => {

    const {data, loading, error} = useQuery<any>(GET_SHALLOW_QUESTIONNAIRE_INFO);

    if (loading) return <div>'Loading...'</div>;
    if (error) return <div>{'Error!' + error.message}</div>;

    return (
        <Div useFlex flexDirection='column' justifyContent='space-between' height={['100vh', '80vh']}>
            <H1 textAlign="center" color="white">Questionnaires</H1>

            {data?.questionnaires?.map((questionnaire: any) => {
                return <TopicCard questionnaire={questionnaire} sendCurrentStudyToParent={sendCurrentStudyToParent}></TopicCard>
            })}
        </Div>
    )
}

const TopicCard = ({ questionnaire, sendCurrentStudyToParent }: { questionnaire: any, sendCurrentStudyToParent: any }) => (
    <Card useFlex flexDirection="column" onClick={() => sendCurrentStudyToParent(questionnaire.id)}>
      <CardBody flex="100%">
        <Flex alignItems="center" justifyContent="space-between">
          <H3 fontWeight={500}>
            {questionnaire.title}
          </H3>
        </Flex>
      </CardBody>
    </Card>
  );