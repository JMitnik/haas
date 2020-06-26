import { Redirect } from 'react-router';
import { useCustomer } from 'providers/CustomerProvider';
import React from 'react';

const ProtectedRoute = () => {
  const { activeCustomer } = useCustomer();

  //   TODO: Do check for login as well
  if (!activeCustomer) {
    return (
      <Redirect to="/customers" />
    );
  }

  return (
    <div />
  );
};

export default ProtectedRoute;
