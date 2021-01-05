import { gql } from '@apollo/client';

const uploadSingleImage = gql`
  mutation uploadSingleImage($file: Upload!) {
    singleUpload(file: $file) {
        url
    }
  }
`;

export default uploadSingleImage;
