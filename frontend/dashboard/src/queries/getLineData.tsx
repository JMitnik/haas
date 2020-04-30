import gql from 'graphql-tag';

const getLineDataQuery = gql`
query getLineChartData($dialogueId: String) {
  lineChartData(dialogueId: $dialogueId) {
    x
    y
  }
}
`;

export default getLineDataQuery;
