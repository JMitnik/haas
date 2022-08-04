import { Dialogue } from 'types/generated-types';
import React, { useContext, useState } from 'react';

const DialogueContext = React.createContext({} as DialogueContextProps);

interface DialogueContextProps {
  activeDialogue?: Dialogue | null;
  setActiveDialogue: (dialogue: Dialogue | null) => void;
}

interface CustomerProviderProps {
  children: React.ReactNode;
  dialogueOverride?: Dialogue;
}

export const DialogueProvider = ({ children, dialogueOverride }: CustomerProviderProps) => {
  const [activeDialogue, setActiveDialogue] = useState<null | Dialogue>(dialogueOverride || null);

  return (
    <DialogueContext.Provider value={{ activeDialogue, setActiveDialogue }}>
      {children}
    </DialogueContext.Provider>
  );
};

export const useDialogue = () => useContext(DialogueContext);
