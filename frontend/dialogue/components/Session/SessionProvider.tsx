import React, { useContext } from 'react';

const SessionContext = React.createContext({} as SessionContextProps);

interface SessionContextProps {
  sessionId: string;
}

export const SessionProvider = ({ children, sessionId }: {children: React.ReactNode; sessionId: string }) => {
  return (
    <SessionContext.Provider value={{ sessionId }}>
      {children}
    </SessionContext.Provider>
  );
};

export const useSession = () => useContext(SessionContext);
