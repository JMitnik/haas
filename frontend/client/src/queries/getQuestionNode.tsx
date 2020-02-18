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
    # Potential remove
    # children {
    # id
    # title
    # questionType {
    #     type
    # }

    # edgeChildren {
      
    #   parentNode {
    #     id
    #     title
    #   }
      
    #   childNode {
    #     id
    #     title
    #     questionType {
    #       type
    #     }
        
    #     options {
    #       value
    #     }
        
    #     conditions {
    #       conditionType
    #       renderMin
    #       renderMax
    #       matchValue
    #     }
      
    #   }
    # }
    
    # options {
    #     value
    #     publicValue
    # }
    
    # conditions {
    #   conditionType
    #   matchValue
    #   renderMin
    #   renderMax
    # }

    # }
    # Potential remove
  }
}
    `