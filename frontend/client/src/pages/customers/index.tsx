import { useErrorHandler } from 'react-error-boundary';
import { useQuery } from '@apollo/react-hooks';
import React from 'react';

import CustomerOverview from 'views/CustomerOverview/CustomerOverview';
import Loader from 'components/Loader';
import getCustomerQuery from 'queries/getCustomerQuery';

const CustomersPage = () => <CustomerOverview />;

export default CustomersPage;
