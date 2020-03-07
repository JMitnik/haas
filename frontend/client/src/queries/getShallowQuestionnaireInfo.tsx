import gql from 'graphql-tag';

export const GET_SHALLOW_QUESTIONNAIRE_INFO = gql`
      query getShallowQuestionnaireInfo {
        questionnaires {
            title
            id
        }
    }
`