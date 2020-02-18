
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
    questions {
    id
    title
    questionType {
        type
    }
    edgeChildren {
      id
      parentNode {
        id
        title
      }
      childNode {
        id
        title
        questionType {
          type
        }
        options {
          value
        }
        conditions {
          conditionType
          renderMin
          renderMax
          matchValue
        }
      }
    }
    options {
        value
        publicValue
    }
    conditions {
      conditionType
      matchValue
      renderMin
      renderMax
    }
}
    customer {
      id
    	settings {
        colourSettings {
          id
          title
          primary
          secondary
          tertiary
          success
          warning
          error
          lightest
          light
          normal
          dark
          darkest
          muted
          text
        }
      }
  	}
  }
}
`;