import { Dialogue } from 'types/generated-types';
import React, { useContext, useState } from 'react';

const DialogueContext = React.createContext({} as DialogueContextProps);

interface DialogueContextProps {
  activeDialogue?: Dialogue | null;
  setActiveDialogue: (dialogue: Dialogue | null) => void;
}

export const DialogueProvider = ({ children }: { children: React.ReactNode }) => {
  const [activeDialogue, setActiveDialogue] = useState<null | Dialogue>(null);

  return (
    <DialogueContext.Provider value={{ activeDialogue, setActiveDialogue }}>
      {children}
    </DialogueContext.Provider>
  );
};

export const useDialogue = () => useContext(DialogueContext);
