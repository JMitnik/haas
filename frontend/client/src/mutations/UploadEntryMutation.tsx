import gql from 'graphql-tag';

const uploadUserSessionMutation = gql`
    mutation uploadUserSession($uploadUserSessionInput: UploadUserSessionInput) {
        uploadUserSession(uploadUserSessionInput: $uploadUserSessionInput)
    }
`;

export default uploadUserSessionMutation;
