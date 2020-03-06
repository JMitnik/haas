
import gql from 'graphql-tag';

export const GET_QUESTIONNAIRE = gql`
      query getQuestionnaire ($id: ID) {
        questionnaire(where: {
    id: $id
  }) {
    id
    title
    publicTitle
    creationDate
    updatedAt
    leafs {
        id
        title
        type
    }
    customer {
        name
        settings {
          logoUrl
          colourSettings {
            primary
            secondary
          }
        }
    }
    questions {
    id
    title
    overrideLeaf {
      id
    }
    questionType
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
}
`;