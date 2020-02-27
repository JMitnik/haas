
import gql from 'graphql-tag';

// TODO: Make more dynamic
// TODO: Express nodes using Fragments
export const getQuestionnaireQuery = gql`
  query getQuestionnaire ($id: ID) {
    questionnaire(where: {
      id: $id
    }) {
      id
      title
      publicTitle
      creationDate
      updatedAt
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
        children {
          id
          title
          questionType
          overrideLeaf {
            id
          }
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
            overrideLeaf {
              id
            }
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
              overrideLeaf {
                id
              }
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
      leafs {
        id
        title
        type
      }
    }
  }
`;

