import { useLazyQuery } from '@apollo/react-hooks';
import { useParams } from 'react-router-dom';
import React, { useContext, useEffect, useState } from 'react';
import gql from 'graphql-tag';

import { useAuth } from './AuthProvider';

const CustomerContext = React.createContext({} as any);

const getCustomerOfUser = gql`
  query getCustomerOfUser($input: UserOfCustomerInput) {
    UserOfCustomer(input: $input) {
      customer {
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
      role {
        permissions
      }
      user {
        id
      }
    }
  }
`;

const CustomerProvider = ({ children }: { children: React.ReactNode }) => {
  const auth = useAuth();
  const { customerSlug } = useParams<{ customerSlug: string }>();

  // Synchronize customer with localstorage
  const [activeCustomer, setActiveCustomer] = useState(() => {
    try {
      const localCustomer = JSON.parse(localStorage.getItem('customer') || '{}');
      if (!localCustomer?.id) return '';
      return localCustomer;
    } catch (e) {
      localStorage.removeItem('customer');

      return null;
    }
  });

  useEffect(() => {
    localStorage.setItem('customer', JSON.stringify(activeCustomer));

    return () => {
      localStorage.removeItem('customer');
    };
  }, [activeCustomer]);

  // Synchronize role with localstorage
  const [activeRole, setActiveRole] = useState(() => {
    try {
      const localRole = JSON.parse(localStorage.getItem('role') || '{}');
      if (!localRole?.permissions) return '';
      return localRole;
    } catch (e) {
      localStorage.removeItem('role');

      return null;
    }
  });

  useEffect(() => {
    localStorage.setItem('role', JSON.stringify(activeRole));

    return () => {
      localStorage.removeItem('role');
    };
  }, [activeRole]);

  const [fetchCustomer] = useLazyQuery(getCustomerOfUser, {
    onCompleted: (result: any) => {
      setActiveCustomer(result?.UserOfCustomer.customer);
      setActiveRole(result?.UserOfCustomer.role);
    },
  });

  useEffect(() => {
    if ((customerSlug)) {
      fetchCustomer({
        variables: {
          input: {
            userId: auth.user?.id,
            customerSlug,
          },
        },
      });
    }
  }, [customerSlug, auth, fetchCustomer]);

  return (
    <CustomerContext.Provider value={{ activeCustomer, setActiveCustomer }}>
      {children}
    </CustomerContext.Provider>
  );
};

export const useCustomer = () => useContext(CustomerContext);

export default CustomerProvider;
