
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