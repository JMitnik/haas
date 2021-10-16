import * as UI from '@haas/ui';
import { Clock, Mail, Plus, Settings, Smartphone } from 'react-feather';
import { ErrorBoundary } from 'react-error-boundary';
import { Route, Switch, useLocation } from 'react-router';
import { format } from 'date-fns';
import { union } from 'lodash';
import { useTranslation } from 'react-i18next';
import React, { useState } from 'react';

import * as Table from 'components/Common/Table';
import {
  CampaignVariantEnum, DeliveryConnectionFilter, DeliveryStatusEnum, DeliveryType,
  GetWorkspaceCampaignQuery,
  PaginationSortByEnum, useGetWorkspaceCampaignQuery,
} from 'types/generated-types';
import { DeepPartial } from 'types/customTypes';
import { ROUTES, useNavigator } from 'hooks/useNavigator';
import { useLogger } from 'hooks/useLogger';
import CreateCampaignForm, { CampaignFormProps } from 'views/CampaignsView/CreateCampaignForm';

import { AnimatePresence, motion } from 'framer-motion';
import { CampaignType } from './CampaignViewTypes';
import { DeliveryModalCard } from './DeliveryModalCard';
// eslint-disable-next-line import/no-cycle
import { ImportDeliveriesForm } from './ImportDeliveriesForm';

export const defaultCampaignViewFilter: DeliveryConnectionFilter = {
  paginationFilter: {
    limit: 10,
    startDate: undefined,
    endDate: undefined,
    pageIndex: 0,
    offset: 0,
    orderBy: [
      {
        by: PaginationSortByEnum.ScheduledAt,
        desc: true,
      },
      {
        by: PaginationSortByEnum.UpdatedAt,
        desc: true,
      },
    ],
  },
};

const POLL_INTERVAL_SECONDS = 30;

const DeliveryScheduledLabel = ({ scheduledAt }: { scheduledAt: string }) => {
  const date = new Date(parseInt(scheduledAt, 10));

  return (
    <UI.Flex alignItems="center">
      <UI.Icon pr={1}>
        <Clock width="0.7rem" />
      </UI.Icon>
      {format(date, 'MM/dd HH:mm')}
    </UI.Flex>
  );
};

const DeliveryStatus = ({ delivery }: { delivery: DeepPartial<DeliveryType> }) => {
  const status = delivery.currentStatus;

  switch (status) {
    case DeliveryStatusEnum.Finished: {
      return (
        <UI.Label variantColor="green">
          {status}
        </UI.Label>
      );
    }

    case DeliveryStatusEnum.Deployed: {
      return (
        <UI.Label variantColor="blue">
          {status}
        </UI.Label>
      );
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
                      // @ts-ignore
                      <DeliveryScheduledLabel scheduledAt={delivery.scheduledAt} />
                    )}
                  </UI.Span>
                </>
              </UI.Stack>
            </UI.Div>
          </ErrorBoundary>
        </UI.Label>
      );
    }

    case DeliveryStatusEnum.Opened: {
      return (
        <UI.Label variantColor="yellow">{status}</UI.Label>
      );
    }

    case DeliveryStatusEnum.Failed: {
      return (
        <UI.Label variantColor="red">{status}</UI.Label>
      );
    }

    case DeliveryStatusEnum.Delivered: {
      return (
        <UI.Label variantColor="cyan">{status}</UI.Label>
      );
    }
    default: {
      return (
        <UI.Label variantColor="blue">{status}</UI.Label>
      );
    }
  }
};

const campaignToForm = (campaign: CampaignType): CampaignFormProps => ({
  label: campaign.label,
  // @ts-ignore
  customVariables: union(campaign.variants.map((variant) => variant.customVariables.map((variable) => variable.key))),
  variants: campaign.variants.map((variant) => ({
    body: variant.body,
    dialogue: { label: variant.dialogue.title, value: variant.dialogue.id },
    from: variant.from || '',
    label: variant.label,
    type: variant.type,
    weight: variant.weight,
  })),
});

export const CampaignView = () => {
  const [isOpenImportModal, setIsOpenImportModal] = useState(false);
  const [isOpenSettingsModal, setIsOpenSettingsModal] = useState(false);
  const { t } = useTranslation();
  const logger = useLogger();
  const location = useLocation();

  const [paginationState, setPaginationState] = useState(defaultCampaignViewFilter);

  const { customerSlug, campaignId, getCampaignsPath, goToCampaignView, goToDeliveryView } = useNavigator();
  const campaignsPath = getCampaignsPath();

  // For tables we will consider data-caches.
  // useTableData
  const [dataCache, setDataCache] = useState<GetWorkspaceCampaignQuery | undefined>(undefined);
  const { data, loading } = useGetWorkspaceCampaignQuery({
    fetchPolicy: 'cache-and-network',
    variables: {
      campaignId,
      customerSlug,
      deliveryConnectionFilter: paginationState,
    },
    pollInterval: POLL_INTERVAL_SECONDS * 1000,
    onCompleted: (completeData) => setDataCache(completeData),
    onError: (error) => logger.logError(error, {
      tags: { section: 'campaign' },
    }),
  });

  // use-table-select placement
  // const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // const handleSelect = (id: string) => {
  //   if (selectedIds.includes(id)) {
  //     console.log(selectedIds);
  //     setSelectedIds(ids => ids.splice(ids.indexOf(id), 1));
  //   } else {
  //     setSelectedIds(ids => [...ids, id]);
  //   }
  // }

  // const isInEdit = selectedIds.length > 0;

  // use-table-select end

  const columns = 'minmax(200px, 1fr) minmax(150px, 1fr) minmax(300px, 1fr) minmax(300px, 1fr)';

  const campaign = dataCache?.customer?.campaign || null;
  const deliveryConnection = campaign?.deliveryConnection;

  return (
    <>
      <UI.ViewHead>
        <UI.Flex justifyContent="space-between" width="100%" alignItems="flex-end">
          <UI.Stack>
            <UI.Breadcrumb to={campaignsPath}>{t('back_to_campaigns')}</UI.Breadcrumb>
            <UI.Stack isInline alignItems="center" spacing={4}>
              <UI.ViewTitle>{campaign?.label}</UI.ViewTitle>
              <UI.Button
                leftIcon={Plus}
                onClick={() => setIsOpenImportModal(true)}
                size="sm"
                variantColor="teal"
              >
                {t('import_deliveries')}
              </UI.Button>
            </UI.Stack>
          </UI.Stack>

          <UI.Button
            leftIcon={Settings}
            size="md"
            variant="outline"
            onClick={() => setIsOpenSettingsModal(true)}
          >
            Settings
          </UI.Button>
        </UI.Flex>

      </UI.ViewHead>
      <UI.ViewBody>
        <UI.Div>
          <Table.HeadingRow gridTemplateColumns={columns}>
            <Table.HeadingCell>
              {t('recipient')}
            </Table.HeadingCell>
            <Table.HeadingCell>
              {t('recipient_adress')}
            </Table.HeadingCell>
            <Table.HeadingCell>
              {t('variant')}
            </Table.HeadingCell>
            <Table.HeadingCell>
              {t('status')}
            </Table.HeadingCell>
          </Table.HeadingRow>
          {deliveryConnection?.deliveries.map((delivery) => (
            <Table.Row key={delivery.id} gridTemplateColumns={columns}>
              <Table.Cell>
                {delivery.deliveryRecipientFirstName}
              </Table.Cell>
            </Table.Row>
          ))}
        </UI.Div>
        {(deliveryConnection?.pageInfo?.nrPages || 0) > 1 && (
          <UI.PaginationFooter>
            <UI.Div style={{ lineHeight: 'normal' }}>
              Showing page
              <UI.Span ml={1} fontWeight="bold">
                {(paginationState.paginationFilter?.pageIndex || 0) + 1}
              </UI.Span>
              <UI.Span ml={1}>
                out of
              </UI.Span>
              <UI.Span ml={1} fontWeight="bold">
                {deliveryConnection?.pageInfo.nrPages}
              </UI.Span>
              <UI.Span ml={3}>
                (Total deliveries:
                {' '}
                {data?.customer?.campaign?.allDeliveryConnection?.nrTotal}
                )
              </UI.Span>
            </UI.Div>

            <UI.Div>
              <UI.Stack isInline alignItems="center">
                <UI.Div>
                  <UI.Button
                    size="sm"
                    variantColor="teal"
                    onClick={() => setPaginationState((state) => ({
                      ...state,
                      paginationFilter: {
                        ...state.paginationFilter,
                        pageIndex: (state.paginationFilter?.pageIndex || 0) - 1,
                        offset: (state.paginationFilter?.offset || 0) - (state.paginationFilter?.limit || 0),
                      },
                    }))}
                    isDisabled={paginationState.paginationFilter?.pageIndex === 0}
                  >
                    Previous
                  </UI.Button>
                </UI.Div>

                <UI.Div>
                  <UI.DebouncedInput
                    value={(paginationState.paginationFilter?.pageIndex || 0) + 1}
                    onChange={(val) => setPaginationState((state) => ({
                      ...state,
                      paginationFilter: {
                        ...state.paginationFilter,
                        pageIndex: val - 1,
                        offset: Math.max((val - 1), 0) * (state.paginationFilter?.limit || 0),
                      },
                    }))}
                  />
                </UI.Div>
                <UI.Button
                  size="sm"
                  variantColor="teal"
                  onClick={() => setPaginationState((state) => ({
                    ...state,
                    paginationFilter: {
                      ...state.paginationFilter,
                      pageIndex: (state.paginationFilter?.pageIndex || 0) + 1,
                      offset: (state.paginationFilter?.offset || 0) + (state.paginationFilter?.limit || 0),
                    },
                  }))}
                  isDisabled={
                    (paginationState.paginationFilter?.pageIndex || 0) + 1 === deliveryConnection?.pageInfo.nrPages
                  }
                >
                  Next
                </UI.Button>
              </UI.Stack>
            </UI.Div>
          </UI.PaginationFooter>
        )}

        <UI.Modal isOpen={isOpenImportModal} onClose={() => setIsOpenImportModal(false)}>
          <UI.ModalCard maxWidth={1200} onClose={() => setIsOpenImportModal(false)}>
            <UI.ModalBody>
              <ImportDeliveriesForm
                onClose={() => setIsOpenImportModal(false)}
              />
            </UI.ModalBody>
          </UI.ModalCard>
        </UI.Modal>

        {!!campaign && (
          <UI.Modal isOpen={isOpenSettingsModal} onClose={() => setIsOpenSettingsModal(false)}>
            <UI.ModalCard maxWidth={1200} onClose={() => setIsOpenSettingsModal(false)}>
              <UI.ModalBody>
                <CreateCampaignForm
                  onClose={() => setIsOpenSettingsModal(false)}
                  // @ts-ignore
                  campaign={campaignToForm(campaign)}
                  isReadOnly
                />
              </UI.ModalBody>
            </UI.ModalCard>
          </UI.Modal>
        )}

        <AnimatePresence>
          <Switch
            location={location}
            key={location.pathname}
          >
            <Route
              path={ROUTES.DELIVERY_VIEW}
            >
              {({ match }) => (
                <motion.div
                  key={location.pathname}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <UI.Modal isOpen onClose={() => goToCampaignView(campaignId)}>
                    <DeliveryModalCard
                      onClose={() => goToCampaignView(campaignId)}
                      // @ts-ignore
                      id={match?.params?.deliveryId}
                    />
                  </UI.Modal>
                </motion.div>
              )}
            </Route>
          </Switch>
        </AnimatePresence>
      </UI.ViewBody>
    </>
  );
};
