import React, { useContext, useState } from 'react';

import { dialogueStatistics_customer_dialogue as Dialogue } from 'views/DialogueView/__generated__/dialogueStatistics';

const DialogueContext = React.createContext({} as DialogueContextProps);

interface DialogueContextProps {
  activeDialogue?: Dialogue | null;
  setActiveDialogue: (dialogue: Dialogue | null) => void;
}

export const DialogueProvider = ({ children }: { children: React.ReactNode }) => {
  const [activeDialogue, setActiveDialogue] = useState<null | Dialogue>(null);

  console.log(activeDialogue);

  return (
    <DialogueContext.Provider value={{ activeDialogue, setActiveDialogue }}>
      {children}
    </DialogueContext.Provider>
  );
};

export const useDialogue = () => useContext(DialogueContext);
