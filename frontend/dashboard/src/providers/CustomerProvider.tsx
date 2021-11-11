import { useHistory, useParams } from 'react-router-dom';
import React, { useContext, useEffect, useState } from 'react';

import { Customer, RoleType, SystemPermission, useGetCustomerOfUserQuery } from 'types/generated-types';

import { useUser } from './UserProvider';

const CustomerContext = React.createContext({} as CustomerContextProps);

interface CustomerProps extends Customer {
  userRole: {
    __typename?: 'RoleType' | undefined;
  } & Pick<RoleType, 'name' | 'permissions'>;
}

interface CustomerContextProps {
  setActiveCustomer: (customer: CustomerProps | null) => void;
  activeCustomer?: CustomerProps | null;
  activePermissions?: SystemPermission[];
}

const CustomerProvider = ({ children }: { children: React.ReactNode }) => {
  const { user } = useUser();
  const history = useHistory();
  const { customerSlug } = useParams<{ customerSlug: string }>();

  // Synchronize customer with localstorage
  const [activeCustomer, setActiveCustomer] = useState<CustomerProps | null>(() => {
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

  useGetCustomerOfUserQuery({
    skip: !customerSlug,
    variables: {
      input: {
        customerSlug,
        userId: user?.id,
      },
    },
    onCompleted: (data) => {
      const customer = data.UserOfCustomer?.customer;
      const role = data.UserOfCustomer?.role;

      if (!customer) {
        history.push('unauthorized');
        return;
      }

      if (!role) {
        history.push('unauthorized');

        return;
      }

      setActiveCustomer({
        ...customer,
        userRole: role,
      });
    },
  });

  const activePermissions = [...(user?.globalPermissions || []), ...(activeCustomer?.userRole?.permissions || [])];

  return (
    <CustomerContext.Provider value={{ activeCustomer, setActiveCustomer, activePermissions }}>
      {children}
    </CustomerContext.Provider>
  );
};

export const useCustomer = () => useContext(CustomerContext);

export default CustomerProvider;
