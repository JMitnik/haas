import React from 'react';

import { Customer, Dialogue as DialogueType } from 'types/generated-types';
import AppProviders from 'config/AppProviders';
import DialogueThemer from 'config/Theme/DialogueThemer';

import * as LS from './DialogueStyles';
import { DialogueRouter } from './DialogueRouter';

interface DialogueProps {
  dialogue: DialogueType;
  workspace: Customer;
}

const Dialogue = ({ dialogue, workspace }: DialogueProps) => {
  return (
    <AppProviders>
      <DialogueThemer>
        <LS.DialogueContainer>
          <DialogueRouter />
        </LS.DialogueContainer>
      </DialogueThemer>
    </AppProviders>
  )
}

export default Dialogue;
