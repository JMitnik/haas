
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
      questionType {
        type
      }
      children {
        id
        title
        questionType {
        type
      	}
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
          questionType {
        		type
      		}
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
            questionType {
        			type
      			}
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

