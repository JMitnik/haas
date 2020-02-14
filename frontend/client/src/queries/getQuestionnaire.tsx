
import gql from 'graphql-tag';

export const GET_QUESTIONNAIRE = gql`
      query getQuestionnaire {
        questionnaire(where: {
    id: "ck6lrox2w01650783lo0kxom8"
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
  }
}
`;

