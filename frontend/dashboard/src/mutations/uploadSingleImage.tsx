import gql from 'graphql-tag';

const uploadSingleImage = gql`
  mutation uploadSingleImage($file: Upload!) {
    singleUpload(file: $file) {
        url
    }
  }
`;

export default uploadSingleImage;
