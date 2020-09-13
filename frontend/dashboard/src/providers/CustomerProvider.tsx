import { useLazyQuery } from '@apollo/react-hooks';
import { useParams } from 'react-router-dom';
import React, { useContext, useEffect, useState } from 'react';
import gql from 'graphql-tag';
import useLocalStorage from 'hooks/useLocalStorage';

import { useAuth } from './AuthProvider';

const CustomerContext = React.createContext({} as any);

const getCustomerQuery = gql`
  query getEditCustomer($customerSlug: String!, $userId: String!) {
    user(userId: $userId) {
      customer(slug: $customerSlug) {
        id
        name
        slug
        settings {
          logoUrl
          colourSettings {
            primary
          }
        }
      }
    }
  }
`;

const CustomerProvider = ({ children }: { children: React.ReactNode }) => {
  const auth = useAuth();
  const [activeCustomer, setActiveCustomer] = useState();
  const [storageCustomer, setStorageCustomer] = useLocalStorage('customer', activeCustomer);
  const { customerSlug } = useParams();

  const [fetchCustomer] = useLazyQuery(getCustomerQuery, {
    onCompleted: (result: any) => {
      setActiveCustomer(result?.customer);

      setStorageCustomer(result?.customer);
    },
  });

  useEffect(() => {
    if ((customerSlug)) {
      fetchCustomer({
        variables: {
          customerSlug,
          userId: auth.user.id,
        },
      });
    }
  }, [customerSlug, auth, fetchCustomer]);

  return (
    <CustomerContext.Provider value={{ activeCustomer, setActiveCustomer, storageCustomer, setStorageCustomer }}>
      {children}
    </CustomerContext.Provider>
  );
};

export const useCustomer = () => useContext(CustomerContext);

export default CustomerProvider;
