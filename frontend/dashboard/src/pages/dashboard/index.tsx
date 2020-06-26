import { Redirect } from 'react-router';
import React from 'react';

// Here check if our account has access to more than one customer.
const DashboardPage = () => (
  <Redirect to="/dashboard/b" />
);

export default DashboardPage;
