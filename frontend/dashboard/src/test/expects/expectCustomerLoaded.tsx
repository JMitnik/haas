import { screen, waitFor } from '@testing-library/react';

/**
 * Expect that workspace data is loaded.
 *
 * - This is a handy check to ensure that all the data of a user for a workspace has been laoded in.
 */
export const expectWorkspaceLoaded = async () => {
  await waitFor(() => {
    expect(screen.queryByTestId('runner')).not.toBeInTheDocument();
  });
};
