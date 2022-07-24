import { Redirect } from 'react-router';
import { useErrorHandler } from 'react-error-boundary';
import { useQuery } from '@apollo/client';
import React from 'react';

import { getCustomers as CustomerData } from 'queries/__generated__/getCustomers';
import { WorkspaceOverview } from 'views/WorkspaceOverview';
import { useUser } from 'providers/UserProvider';
import getCustomersOfUser from 'queries/getCustomersOfUser';
import useAuth from 'hooks/useAuth';

const CustomersPage = () => {
  const { user } = useUser();
  const { canAccessAdmin } = useAuth();

  const { loading, error, data } = useQuery<CustomerData>(getCustomersOfUser, {
    fetchPolicy: 'network-only',
    variables: {
      userId: user?.id,
    },
  });
  useErrorHandler(error);

  const customers = data?.user?.customers || [];

  // Redirect to single customer
  if (user?.userCustomers?.length === 1 && !canAccessAdmin) {
    const [userCustomer] = user.userCustomers;
    const redirectSlug = userCustomer?.customer?.slug;

    return <Redirect to={`/dashboard/b/${redirectSlug}`} />;
  }

  return <WorkspaceOverview isLoading={loading} customers={customers} />;
};

export default CustomersPage;
