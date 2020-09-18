import { Redirect } from 'react-router';
import React from 'react';

import { useCustomer } from 'providers/CustomerProvider';

const DashboardPage = () => {
  // const { user } = useUser();

  const { activeCustomer, storageCustomer } = useCustomer();

  // Note-Login: Uncomment this for login
  // if (!user) return <Redirect to="/login" />;

  // if (activeCustomer) {
  //   return (
  //     <Redirect to={`/dashboard/b/${activeCustomer.slug}`} />
  //   );
  // }

  // if (storageCustomer) {
  //   return (
  //     <Redirect to={`/dashboard/b/${storageCustomer.slug}`} />
  //   );
  // }

  return (
    <Redirect to="/dashboard/b" />
  );
};

export default DashboardPage;
