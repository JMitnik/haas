import React, { useContext } from 'react';
import { useState } from 'react';

const CampaignContext = React.createContext({} as CampaignContextProps);

interface CampaignContextProps {

}

export const CampaignProvider = ({ children }: {children: React.ReactNode }) => {
  const [deliveryId, setDeliveryId] = useState(null);
  return (
    <CampaignContext.Provider value={{deliveryId, setDeliveryId}}>
      {children}
    </CampaignContext.Provider>
  );
};

export const useCampaign = () => useContext(CampaignContext);