import gql from 'graphql-tag';

export const GET_QUESTION_NODE = gql`
      query getQuestionNode($id: ID!) {
  questionNode(where: {
    id: $id
  }) {
    id
    title
    overrideLeafId

    questionType {
        type
    }

    edgeChildren {
      id
      conditions {
        conditionType
        matchValue
        renderMin
        renderMax
      }

      parentNode {
        id
        title
      }

      childNode {
        id
        title    
      }
    }

    options {
        value
        publicValue
    }

  }
}
    `