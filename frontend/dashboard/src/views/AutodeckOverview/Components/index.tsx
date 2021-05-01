import React from 'react'
import { format } from 'date-fns';
import * as UI from '@haas/ui';
import { CreateWorkspaceJobType, JobStatusType } from "types/generated-types";
import { DeepPartial } from "types/customTypes";
import { Clock } from 'react-feather';

export const DateLabel = ({ dateString }: { dateString: string }) => {
  const date = new Date(parseInt(dateString, 10));

  return (
    <UI.Flex alignItems="center">
      <UI.Icon pr={1}>
        <Clock width="0.7rem" />
      </UI.Icon>
      {format(date, 'MM/dd HH:mm')}
    </UI.Flex>
  )
};

export const ProcessingStatus = ({ job }: { job: DeepPartial<CreateWorkspaceJobType> }) => {
  const status = job.status;

  switch (status) {
    case JobStatusType.Completed: {
      return (
        <UI.Label variantColor="green">
          {status}
        </UI.Label>
      );
    }

    case JobStatusType.ReadyForProcessing: {
      return (
        <UI.Label variantColor="blue">
          {status}
        </UI.Label>
      )
    }

    case JobStatusType.Failed: {
      return (
        <UI.Label variantColor="red">
          {status}
        </UI.Label>
      )
    }

    case JobStatusType.InPhotoshopQueue: {
      return (
        <UI.Label variantColor="purple">
          {status}
        </UI.Label>
      )
    }

    case JobStatusType.Processing: {
      return (
        <UI.Label variantColor="pink">
          {status}
        </UI.Label>
      )
    }

    default: {
      return (
        <UI.Label variantColor="yellow">{status}</UI.Label>
      )
    }
  }
}