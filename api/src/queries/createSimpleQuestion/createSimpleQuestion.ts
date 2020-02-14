const { gql } = require('apollo-server');

export const createSimpleQuestion = gql`
mutation createSingleQuestion($data: QuestionNodeCreateInput!) {
  createQuestionNode(data: $data) {
    title
    questionType {
      type
    }
  }
}
`
