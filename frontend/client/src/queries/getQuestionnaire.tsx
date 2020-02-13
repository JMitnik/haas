
import gql from 'graphql-tag';

export const GET_QUESTIONNAIRE = gql`
      query getQuestionnaire {
  questionnaire(where: {
    id: "ck6k6y8br00sl0783cxw52ssd"
  }) {
    id
    title
    publicTitle
    creationDate
    updatedAt
    questions {
      id
      title
      questionType
      overrideLeafId
      children {
        id
        title
        overrideLeafId
        questionType
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
          questionType
          overrideLeafId
          title
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
            questionType
            overrideLeafId
            title
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
  leafNodes {
    title
    nodeId
    type
  }
}
`;

