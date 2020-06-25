import React, { useContext, useState } from 'react';

const CustomerContext = React.createContext({} as any);

const CustomerProvider = ({ children }: { children: React.ReactNode }) => {
  const [activeCustomer, setActiveCustomer] = useState();

  return (
    <CustomerContext.Provider value={{ activeCustomer, setActiveCustomer }}>
      {children}
    </CustomerContext.Provider>
  );
};

export const useCustomer = () => useContext(CustomerContext);

export default CustomerProvider;
