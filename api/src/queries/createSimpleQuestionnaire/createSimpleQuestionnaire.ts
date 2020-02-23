const { gql } = require('apollo-server');

export const createSimpleQuestionnaire = gql`
mutation createQuestionnaireSkeleton($data: QuestionnaireCreateInput!) {
  createQuestionnaire(data: $data) {
    title
    publicTitle
    description
    creationDate
    updatedAt
  }
}
`