import { ApolloClient } from 'apollo-client';
import { InMemoryCache, NormalizedCacheObject } from 'apollo-cache-inmemory';
import { HttpLink } from 'apollo-link-http';
import gql from "graphql-tag";

const cache = new InMemoryCache();
const link = new HttpLink({
  uri: 'http://localhost:4000/graphql'
});

const client: ApolloClient<NormalizedCacheObject> = new ApolloClient({
  cache,
  link
});

// client
//   .query({
//     query: gql`
//       query getQuestionnaire {
//   questionnaire(where: {
//     id: "ck6k6y8br00sl0783cxw52ssd"
//   }) {
//     id
//     title
//     publicTitle
//     creationDate
//     updatedAt
//     questions {
//       id
//       questionType
//       overrideLeafId
//       children {
//         id
//         title
//         overrideLeafId
//         questionType
//         conditions {
//           id
//           matchValue
//           renderMin
//           renderMax
//         }
//         options {
//           value
//           publicValue
//         }
//         children {
//           id
//           questionType
//           overrideLeafId
//           title
//           options {
//             value
//             publicValue
//           }
//           conditions {
//             id
//             matchValue
//             renderMin
//             renderMax
//           }
//           children {
//           	id
//             questionType
//             overrideLeafId
//             title
//             options {
//               value
//               publicValue
//             }
//             conditions {
//               id
//               matchValue
//               renderMin
//               renderMax
//             }  
//           }
//         }
//       }
//       conditions {
//         id
//         matchValue
//         renderMin
//         renderMax
//       }
//       options {
//         id
//         value
//         publicValue
//       }    
//     }
//   }
// }
//     `
//   })
//   .then(result => console.log(result))
//   .catch(err => console.log(err));

export default client;