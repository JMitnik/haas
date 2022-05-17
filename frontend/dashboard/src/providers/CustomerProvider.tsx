import { useHistory, useParams } from 'react-router-dom';
import React, { useContext, useEffect, useState } from 'react';

import { Customer, Dialogue, RoleType, SystemPermission, useGetCustomerOfUserQuery } from 'types/generated-types';

import { useUser } from './UserProvider';

const CustomerContext = React.createContext({} as CustomerContextProps);

interface CustomerProps extends Customer {
  userRole: {
    __typename?: 'RoleType' | undefined;
  } & Pick<RoleType, 'name' | 'permissions'>;
  user?: {
    id: string | undefined;
    assignedDialogues?: PrivateDialogueProps | null;
  }
}

interface PrivateDialogueProps {
  privateWorkspaceDialogues?: ({} & Pick<Dialogue, 'title' | 'slug' | 'id'>)[];
  assignedDialogues?: ({} & Pick<Dialogue, 'slug' | 'id'>)[];
}

interface CustomerContextProps {
  isLoading: boolean;
  setActiveCustomer: (customer: CustomerProps | null) => void;
  activeCustomer?: CustomerProps | null;
  activePermissions?: SystemPermission[];
  assignedDialogues?: PrivateDialogueProps | null;
}

interface CustomerProviderProps {
  children: React.ReactNode;
  workspaceOverrideSlug?: string;
  __test__: boolean;
}

const CustomerProvider = ({ children, workspaceOverrideSlug, __test__ = false }: CustomerProviderProps) => {
  const { user } = useUser();
  const history = useHistory();
  const { customerSlug } = useParams<{ customerSlug: string }>();
  const workspaceSlug = customerSlug || workspaceOverrideSlug;

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

  const { loading: isLoading } = useGetCustomerOfUserQuery({
    skip: !workspaceSlug || __test__,
    fetchPolicy: 'cache-and-network',
    variables: {
      input: {
        customerSlug: workspaceSlug,
        userId: user?.id,
      },
    },
    onCompleted: (data) => {
      const customer = data.UserOfCustomer?.customer;
      const role = data.UserOfCustomer?.role;
      const newUser = data.UserOfCustomer?.user;

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
        user: newUser,
        userRole: role,
      });
    },
  });

  const activePermissions = [...(user?.globalPermissions || []), ...(activeCustomer?.userRole?.permissions || [])];

  const assignedDialogues = activeCustomer?.user?.assignedDialogues;

  return (
    <CustomerContext.Provider value={{
      activeCustomer, setActiveCustomer, activePermissions, isLoading, assignedDialogues,
    }}
    >
      {children}
    </CustomerContext.Provider>
  );
};

export const useCustomer = () => useContext(CustomerContext);

export default CustomerProvider;
