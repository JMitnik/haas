import * as UI from '@haas/ui';
import { AnimatePresence, motion } from 'framer-motion';
import { ApolloCache, DefaultContext, FetchResult, MutationFunctionOptions } from '@apollo/client';
import React, { useState } from 'react';

import * as Popover from 'components/Common/Popover';
import {
  ActionRequestState,
  Exact,
  SetActionRequestStatusInput,
  SetActionRequestStatusMutation,
} from 'types/generated-types';
import { useCustomer } from 'providers/CustomerProvider';

import { useUser } from 'providers/UserProvider';
import { StatusBox } from './ActionRequestOverview.styles';

interface ActionableStatusPickerProps {
  value: ActionRequestState;
  onChange: (options?: MutationFunctionOptions<SetActionRequestStatusMutation, Exact<{
    input: SetActionRequestStatusInput;
  }>, DefaultContext, ApolloCache<any>> | undefined
  ) => Promise<FetchResult<SetActionRequestStatusMutation, Record<string, any>, Record<string, any>>>;
  actionRequestId: string;
  onClose: () => void;
}

export const ActionableStatusPickerContent = (
  {
    value,
    onChange,
    actionRequestId,
    onClose,
  }: ActionableStatusPickerProps,
) => {
  const { activeCustomer } = useCustomer();
  const [selected, setSelected] = useState<ActionRequestState>(value);
  const { user } = useUser();

  const handleStatusChange = (entry: ActionRequestState) => {
    setSelected(entry);
    onChange({
      variables: {
        input: {
          workspaceId: activeCustomer?.id as string,
          status: entry,
          actionRequestId,
          userId: user?.id as string,
        },
      },
    });
    onClose();
  };

  return (
    <UI.Card style={{ borderRadius: '5px' }}>
      <UI.Grid gridGap="6px" padding="0.5em">
        {Object.values(ActionRequestState).map((status) => (
          <UI.Div onClick={() => handleStatusChange(status)}>
            <StatusBox isVerified={false} isSelected={selected === status} status={status} />
          </UI.Div>
        ))}
      </UI.Grid>
    </UI.Card>
  );
};

interface ActionableStatusSelectProps {
  onChange: (options?: MutationFunctionOptions<SetActionRequestStatusMutation, Exact<{
    input: SetActionRequestStatusInput;
  }>, DefaultContext, ApolloCache<any>> | undefined
  ) => Promise<FetchResult<SetActionRequestStatusMutation, Record<string, any>, Record<string, any>>>;
  status: ActionRequestState;
  actionRequestId: string;
  isVerified: boolean;
  isDisabled: boolean;
}

export const ActionRequestStatusPicker = (
  {
    onChange,
    status,
    actionRequestId,
    isVerified,
    isDisabled,
  }: ActionableStatusSelectProps,
) => {
  const [open, setOpen] = React.useState(false);

  return (
    <Popover.Root open={open} onOpenChange={setOpen}>
      <Popover.Trigger disabled={isDisabled}>
        <StatusBox isVerified={isVerified} isSelected status={status} />
      </Popover.Trigger>

      <AnimatePresence>
        {open ? (
          <Popover.Content
            isOpen={open}
            alignOffset={undefined}
            portalled={false}
            side="right"
          >
            <motion.div>
              <ActionableStatusPickerContent
                value={status}
                onChange={onChange}
                actionRequestId={actionRequestId}
                onClose={() => setOpen(false)}
              />
            </motion.div>
          </Popover.Content>
        ) : null}
      </AnimatePresence>
    </Popover.Root>
  );
};
