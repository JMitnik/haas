import gql from 'graphql-tag';

const uploadSingleImage = gql`
  mutation uploadSingleImage($file: Upload!) {
    singleUpload(file: $file) {
        filename
    }
  }
`;

export default uploadSingleImage;
