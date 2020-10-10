/* eslint-disable import/prefer-default-export */
import gql from 'graphql-tag';

const createWorkspaceMutation = gql`
  mutation createWorkspace($input: CreateWorkspaceInputType) {
    createWorkspace(input: $input) {
        name
    }
  }
`;

export default createWorkspaceMutation;
