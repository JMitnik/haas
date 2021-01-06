import * as UI from '@haas/ui';
import { format } from 'date-fns';
import { useNavigator } from 'hooks/useNavigator';
import React, { useState } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { Clock, Plus } from 'react-feather';
import { useTranslation } from 'react-i18next';
import { DeepPartial } from 'types/customTypes';
import { DeliveryConnectionFilter, DeliveryStatusEnum, DeliveryType, GetWorkspaceCampaignQuery, PaginationSortByEnum, useGetWorkspaceCampaignQuery } from 'types/generated-types';
import { ImportDeliveriesForm } from './ImportDeliveriesForm';

export const defaultCampaignViewFilter: DeliveryConnectionFilter = {
  paginationFilter: {
    limit: 10,
    startDate: undefined,
    endDate: undefined,
    pageIndex: 0,
    offset: 0,
    orderBy: [{
      by: PaginationSortByEnum.ScheduledAt,
      desc: true,
    }],
  },
};

const POLL_INTERVAL_SECONDS = 60;
const POLL_INTERVAL = POLL_INTERVAL_SECONDS * 1000;

const DeliveryScheduledLabel = ({ scheduledAt }: { scheduledAt: string }) => {
  const date = new Date(parseInt(scheduledAt, 10));

  return (
    <UI.Flex alignItems="center">
      <UI.Icon pr={1}>
        <Clock width="0.7rem" />
      </UI.Icon>
      {format(date, 'MM/dd HH:mm')}
    </UI.Flex>
  )
};

const DeliveryStatus = ({ delivery }: { delivery: DeepPartial<DeliveryType> }) => {
  const status = delivery.currentStatus;

  switch (status) {
    case DeliveryStatusEnum.Finished: {
      return (
        <UI.Label variantColor="red">
          {status}
        </UI.Label>
      );
    }

    case DeliveryStatusEnum.Deployed: {
      return (
        <UI.Label variantColor="blue">
          {status}
        </UI.Label>
      )
    }

    case DeliveryStatusEnum.Scheduled: {
      return (
        <UI.Label>
          <ErrorBoundary FallbackComponent={() => <div>{status}</div>}>
            <UI.Div py={1}>
              <UI.Stack>
                <>
                  <UI.Span>
                    {status}
                  </UI.Span>
                  <UI.Span fontSize="0.6rem">
                    {!!delivery.scheduledAt && (
                      <DeliveryScheduledLabel scheduledAt={delivery.scheduledAt} />
                    )}
                  </UI.Span>
                </>
              </UI.Stack>
            </UI.Div>
          </ErrorBoundary>
        </UI.Label>
      )
    }

    case DeliveryStatusEnum.Opened: {
      return (
        <UI.Label variantColor="yellow">{status}</UI.Label>
      )
    }

    default: {
      return (
        <UI.Label>{status}</UI.Label>
      )
    }
  }
}

export const CampaignView = () => {
  const [isOpenImportModal, setIsOpenImportModal] = useState(false);
  const { t } = useTranslation();

  const { customerSlug, campaignId, getCampaignsPath } = useNavigator();
  const campaignsPath = getCampaignsPath();

  const { data } = useGetWorkspaceCampaignQuery({
    fetchPolicy: 'cache-and-network',
    variables: {
      campaignId,
      customerSlug,
      deliveryConnectionFilter: defaultCampaignViewFilter,
    },
    pollInterval: POLL_INTERVAL
  });

  const campaign = data?.customer?.campaign;
  const deliveryConnection = campaign?.deliveryConnection;

  return (
    <>
      <UI.ViewHeading>
        <UI.Stack>
          <UI.Breadcrumb to={campaignsPath}>{t('back_to_campaigns')}</UI.Breadcrumb>
          <UI.Stack isInline alignItems="center" spacing={4}>
            <UI.PageTitle>{campaign?.label}</UI.PageTitle>
            <UI.Button
              leftIcon={Plus}
              onClick={() => setIsOpenImportModal(true)} size="sm" variantColor="teal">{t('import_deliveries')}</UI.Button>
          </UI.Stack>
        </UI.Stack>
      </UI.ViewHeading>
      <UI.ViewContainer>
        <UI.Card noHover p={2}>
          <UI.Table>
            <UI.TableHeading>
              <UI.TableHeadingCell>
                {t('recipient')}
              </UI.TableHeadingCell>
              <UI.TableHeadingCell>
                {t('recipient_adress')}
              </UI.TableHeadingCell>
              <UI.TableHeadingCell>
                {t('status')}
              </UI.TableHeadingCell>
              <UI.TableHeadingCell>
                {t('variant')}
              </UI.TableHeadingCell>
            </UI.TableHeading>

            <UI.TableBody>
              {deliveryConnection?.deliveries.map(delivery => (
                <UI.TableRow key={delivery.id}>
                  <UI.TableCell>
                    {delivery?.deliveryRecipientFirstName}
                  </UI.TableCell>
                  <UI.TableCell>
                    {delivery?.deliveryRecipientEmail}
                  </UI.TableCell>
                  <UI.TableCell>
                    <DeliveryStatus
                      delivery={delivery}
                    />
                  </UI.TableCell>
                  <UI.TableCell>
                    {delivery?.campaignVariant?.label}
                  </UI.TableCell>
                </UI.TableRow>
              ))}
            </UI.TableBody>
          </UI.Table>
        </UI.Card>

        <UI.Modal isOpen={isOpenImportModal} onClose={() => setIsOpenImportModal(false)}>
          <UI.Card bg="white" noHover width={700}>
            <UI.CardBody>
              <ImportDeliveriesForm
                onClose={() => setIsOpenImportModal(false)} />
            </UI.CardBody>
          </UI.Card>
        </UI.Modal>
      </UI.ViewContainer>
    </>
  )
};