import { GraphQLErrors } from '@apollo/client/errors';

/**
 * Detects if a user is unauthrozied, and if so, removes all information
 * and redirects to logout page.
 * @param errors
 */
export const handleUnauthentication = (errors: GraphQLErrors) => {
  const authorizedErrors = errors.filter((error) => (
    error?.extensions?.code === 'UNAUTHENTICATED'
  ));

  if (authorizedErrors.length) {
    console.log('test');
    localStorage.removeItem('user_data');
    localStorage.removeItem('access_token');
    localStorage.removeItem('customer');
    localStorage.removeItem('role');
    window.location.href = '/logged_out';
  }
};
