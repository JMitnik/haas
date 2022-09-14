import * as Popover from '@radix-ui/react-popover';
import * as UI from '@haas/ui';
import { AnimatePresence, motion } from 'framer-motion';
import { ApolloCache, DefaultContext, FetchResult, MutationFunctionOptions } from '@apollo/client';
import React, { useEffect, useState } from 'react';
import styled, { css } from 'styled-components';

import { ActionableState, Exact, SetActionableStatusInput, SetActionableStatusMutation } from 'types/generated-types';
import { slideUpFadeMotion } from 'components/animation/config';

import { StatusBox } from './IssueOverview.styles';

export const WorkspaceSwitcherContainer = styled(UI.Div)`
  ${({ theme }) => css`
    text-align: left;
    width: 100%;
    position: relative;
    padding: ${theme.gutter}px;
    border-top: 1px solid ${theme.colors.gray[200]};
    border-right: 1px solid ${theme.colors.neutral[500]};
    transition: all ${theme.transitions.slow};

    &:hover {
      background: ${theme.colors.off[100]};
      transition: all ${theme.transitions.slow};

      cursor: pointer;
    }

    ${UI.Icon} svg path {
      stroke: currentColor;
    }
  `}
`;

const Content = styled(Popover.Content)`
  transform-origin: top left;
  z-index: 10000;
  width: 100%;
`;

interface ActionableStatusPickerProps {
  value: ActionableState;
  onChange: (options?: MutationFunctionOptions<SetActionableStatusMutation, Exact<{
    input: SetActionableStatusInput;
  }>, DefaultContext, ApolloCache<any>> | undefined
  ) => Promise<FetchResult<SetActionableStatusMutation, Record<string, any>, Record<string, any>>>;
  actionableId: string;
  onClose: () => void;
}

export const ActionableStatusPickerContent = ({ value, onChange, actionableId, onClose }: ActionableStatusPickerProps) => {
  const [selected, setSelected] = useState<ActionableState>(value);

  const handleStatusChange = (entry: ActionableState) => {
    setSelected(entry);
    onChange({
      variables: {
        input: {
          status: entry,
          actionableId,
        },
      },
    });
    onClose();
  };

  return (
    <UI.Card style={{ borderRadius: '5px' }}>
      <UI.Grid padding="0.5em">
        {Object.values(ActionableState).map((status) => (
          <UI.Div onClick={() => handleStatusChange(status)}>
            <StatusBox isSelected={selected === status} status={status} />
          </UI.Div>

        ))}
      </UI.Grid>
    </UI.Card>
  );
};

interface ActionableStatusSelectProps {
  onChange: (options?: MutationFunctionOptions<SetActionableStatusMutation, Exact<{
    input: SetActionableStatusInput;
  }>, DefaultContext, ApolloCache<any>> | undefined
  ) => Promise<FetchResult<SetActionableStatusMutation, Record<string, any>, Record<string, any>>>;
  status: ActionableState;
  actionableId: string;
}

export const ActionableStatusPicker = ({ onChange, status, actionableId }: ActionableStatusSelectProps) => {
  const [open, setOpen] = React.useState(false);

  return (
    <Popover.Root open={open} onOpenChange={setOpen}>
      <Popover.Trigger>
        <StatusBox isSelected status={status} />
      </Popover.Trigger>

      <AnimatePresence>
        {open ? (
          <Content
            asChild
            forceMount
            forwardedAs={motion.div}
            align="start"
            // alignOffset={12}
            portalled={false}
            side="right"
            {...slideUpFadeMotion}
            style={{ zIndex: 10000 }}
          >
            <motion.div>
              <ActionableStatusPickerContent
                value={status}
                onChange={onChange}
                actionableId={actionableId}
                onClose={() => setOpen(false)}
              />
            </motion.div>
          </Content>
        ) : null}
      </AnimatePresence>
    </Popover.Root>
  );
};
