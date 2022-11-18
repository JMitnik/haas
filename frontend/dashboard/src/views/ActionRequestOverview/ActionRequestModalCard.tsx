import * as UI from '@haas/ui';
import { Clock, Monitor, ThumbsUp } from 'react-feather';
import { useTranslation } from 'react-i18next';
import React from 'react';

import { ActionRequestTimeline } from 'components/ActionRequest/ActionRequestTimeline';
import { Circle } from 'components/Common/Circle';
import { Timeline, TimelineItem } from 'components/Common/Timeline';
import { formatSimpleDate } from 'utils/dateUtils';
import { useCustomer } from 'providers/CustomerProvider';
import { useGetActionRequestQuery } from 'types/generated-types';

interface ActionRequestModalCardProps {
  actionRequestId: string;
}

export const ActionRequestModalCard = ({ actionRequestId }: ActionRequestModalCardProps) => {
  const { t } = useTranslation();
  const { activeCustomer } = useCustomer();
  const { data, loading, error } = useGetActionRequestQuery({
    variables: {
      input: {
        actionRequestId,
        workspaceId: activeCustomer?.id as string,
      }
    },
  });

  const actionRequest = data?.getActionRequest;

  return (
    <>
      <UI.ModalHead>
        <UI.ModalTitle>
          {t('action_request')}
        </UI.ModalTitle>
      </UI.ModalHead>
      <UI.ModalBody>
        {loading && !data && <UI.Loader />}
        {!loading && data && (
          <Timeline>
            {!!actionRequest && (
              <TimelineItem gridTemplateColumns="40px 1fr">
                <Circle brand="blue">
                  <ThumbsUp />
                </Circle>
                <UI.Div>

                  <UI.Div mb={2} color="blue.700">
                    <UI.SectionHeader>{t('entries')}</UI.SectionHeader>
                    <UI.Span>
                      {t('created_at')}
                      {' '}
                      {formatSimpleDate(actionRequest.createdAt)}
                    </UI.Span>
                    <UI.Div mt={1}>
                      <UI.Stack isInline>
                        <UI.Label variantColor="blue" size="sm" fontSize="0.6rem">
                          <UI.Icon mr={1}><Monitor width="0.8rem" /></UI.Icon>
                          {actionRequest.status}
                        </UI.Label>
                        <UI.Label variantColor="blue" size="sm" fontSize="0.6rem">
                          <UI.Icon mr={1}><Clock width="0.8rem" /></UI.Icon>
                          {actionRequest.updatedAt}
                          {' '}
                          {t('seconds')}
                        </UI.Label>
                      </UI.Stack>
                    </UI.Div>
                  </UI.Div>
                  <UI.Div>
                    <ActionRequestTimeline actionRequest={actionRequest} />
                  </UI.Div>
                </UI.Div>
              </TimelineItem>
            )}
          </Timeline>
        )}
        {error && (
          <UI.ErrorPane header="Server problem" text={error.message} />
        )}
      </UI.ModalBody>
    </>
  );
};
