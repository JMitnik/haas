import gql from 'graphql-tag';

const uploadEntryMutation = gql`
    mutation uploadUserEntries($uploadEntriesInput: UploadEntriesInput) {
        uploadUserEntries(uploadEntriesInput: $uploadEntriesInput)
    }
`;

export default uploadEntryMutation;
