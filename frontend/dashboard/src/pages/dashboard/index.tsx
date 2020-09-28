import { Redirect } from 'react-router';
import React from 'react';

import { useCustomer } from 'providers/CustomerProvider';

const DashboardPage = () => (
  <Redirect to="/dashboard/b" />
);

export default DashboardPage;
