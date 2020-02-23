
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
      overrideLeafId
      questionType
      children {
        id
        title
        questionType
        overrideLeafId
        conditions {
          id
          matchValue
          renderMin
          renderMax
        }
        options {
          value
          publicValue
        }
        children {
          id
          overrideLeafId
          title
          questionType
          options {
            value
            publicValue
          }
          conditions {
            id
            matchValue
            renderMin
            renderMax
          }
          children {
          	id
            overrideLeafId
            title
            questionType
            options {
              value
              publicValue
            }
            conditions {
              id
              matchValue
              renderMin
              renderMax
            }
          }
        }
      }
      conditions {
        id
        matchValue
        renderMin
        renderMax
      }
      options {
        id
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

