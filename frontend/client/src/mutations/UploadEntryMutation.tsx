import gql from 'graphql-tag';

const uploadEntryMutation = gql`
    mutation uploadUserEntries($uploadUserSessionInput: UploadUserSessionInput) {
        uploadUserEntries(uploadUserSessionInput: $uploadUserSessionInput)
    }
`;

export default uploadEntryMutation;
