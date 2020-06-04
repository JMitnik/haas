import { Dialogue } from 'types/generic';

export interface ProjectContextProps {
  customer: any | null;
  dialogue: Dialogue | null;
  setCustomer: (customer: any) => void;
  setDialogue: (dialogue: Dialogue | null) => void;
  setCustomerAndDialogue: (customer: any, dialogue: Dialogue | null) => void;
}

export interface ProjectStateProps {
  customer: any | null;
  dialogue: Dialogue | null;
}

export interface ProjectActionSetCustomerProps {
  customer: any;
}

export interface ProjectActionSetDialogueProps {
  dialogue: Dialogue | null;
}

export interface ProjectActionSetCustomerAndDialogueProps {
  customer: any;
  dialogue: Dialogue | null;
}

export type ProjectActionProps = {
  type: 'setCustomer',
  payload: ProjectActionSetCustomerProps
} | {
  type: 'setDialogue',
  payload: ProjectActionSetDialogueProps
} | {
  type: 'setCustomerAndDialogue',
  payload: ProjectActionSetCustomerAndDialogueProps
};
