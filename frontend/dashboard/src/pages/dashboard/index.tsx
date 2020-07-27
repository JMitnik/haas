import { Redirect } from 'react-router';
import React from 'react';

import { useCustomer } from 'providers/CustomerProvider';

const DashboardPage = () => {
  const { activeCustomer, storageCustomer } = useCustomer();

  if (activeCustomer) {
    return (
      <Redirect to={`/dashboard/b/${activeCustomer.slug}`} />
    );
  }

  if (storageCustomer) {
    return (
      <Redirect to={`/dashboard/b/${storageCustomer.slug}`} />
    );
  }
  return (
    <Redirect to="/dashboard/b" />
  );
};

export default DashboardPage;
