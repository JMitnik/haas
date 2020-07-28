import React, { useContext, useState } from 'react';
import useLocalStorage from 'hooks/useLocalStorage';

const CustomerContext = React.createContext({} as any);

const CustomerProvider = ({ children }: { children: React.ReactNode }) => {
  const [activeCustomer, setActiveCustomer] = useState();
  const [storageCustomer, setStorageCustomer] = useLocalStorage('customer', activeCustomer);

  return (
    <CustomerContext.Provider value={{ activeCustomer, setActiveCustomer, storageCustomer, setStorageCustomer }}>
      {children}
    </CustomerContext.Provider>
  );
};

export const useCustomer = () => useContext(CustomerContext);

export default CustomerProvider;
