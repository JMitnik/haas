import * as UI from '@haas/ui';
import { Clock, Plus, Search, Settings } from 'react-feather';
import { ErrorBoundary } from 'react-error-boundary';
import { Route, Switch, useLocation } from 'react-router';
import { format } from 'date-fns';
import { union } from 'lodash';
import { useTranslation } from 'react-i18next';
import React, { useState } from 'react';

import * as Table from 'components/Common/Table';
import { AnimatePresence, motion } from 'framer-motion';
import { BooleanParam, DateTimeParam, NumberParam, StringParam, useQueryParams, withDefault } from 'use-query-params';
import { DeepPartial } from 'types/customTypes';
import {
  DeliveryConnectionOrder, DeliveryStatusEnum,
  DeliveryType,
  GetWorkspaceCampaignQuery, useGetWorkspaceCampaignQuery,
} from 'types/generated-types';
import { DeliveryRecipient } from 'components/Campaign/DeliveryRecipient';
import { DeliveryRecipientAdres } from 'components/Campaign/DeliveryRecipientAdres';
import { PickerButton } from 'components/Common/Picker/PickerButton';
import { ROUTES, useNavigator } from 'hooks/useNavigator';
import { TabbedMenu } from 'components/Common/TabMenu';
import { useLogger } from 'hooks/useLogger';
import CreateCampaignForm, { CampaignFormProps } from 'views/CampaignsView/CreateCampaignForm';
import Searchbar from 'components/SearchBar';

import { CampaignType } from './CampaignViewTypes';
import { DeliveryModalCard } from './DeliveryModalCard';
// eslint-disable-next-line import/no-cycle
import { ImportDeliveriesForm } from './ImportDeliveriesForm';

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

  const { customerSlug, campaignId, getCampaignsPath, goToCampaignView } = useNavigator();
  const campaignsPath = getCampaignsPath();

  const [filter, setFilter] = useQueryParams({
    startDate: DateTimeParam,
    endDate: DateTimeParam,
    search: StringParam,
    pageIndex: withDefault(NumberParam, 0),
    perPage: withDefault(NumberParam, 10),
    filterCampaigns: StringParam,
    filterCampaignId: StringParam,
    orderByField: withDefault(StringParam, DeliveryConnectionOrder.CreatedAt),
    orderByDescending: withDefault(BooleanParam, true),
  });

  // For tables we will consider data-caches.
  // useTableData
  const [dataCache, setDataCache] = useState<GetWorkspaceCampaignQuery | undefined>(undefined);
  const { loading: isLoading, refetch } = useGetWorkspaceCampaignQuery({
    fetchPolicy: 'cache-and-network',
    variables: {
      campaignId,
      customerSlug,
      deliveryConnectionFilter: {
        startDate: filter.startDate ? filter.startDate.toISOString() : undefined,
        endDate: filter.endDate ? filter.endDate.toISOString() : undefined,
        search: filter.search,
        offset: filter.pageIndex * filter.perPage,
        perPage: filter.perPage,
        orderBy: {
          by: filter.orderByField as DeliveryConnectionOrder,
          desc: filter.orderByDescending,
        },
      },
    },
    pollInterval: POLL_INTERVAL_SECONDS * 1000,
    onCompleted: (completeData) => setDataCache(completeData),
    onError: (error) => logger.logError(error, {
      tags: { section: 'campaign' },
    }),
  });

  const totalPages = dataCache?.customer?.campaign?.deliveryConnection?.totalPages || 0;

  const columns = 'minmax(200px, 1fr) minmax(150px, 1fr) minmax(300px, 1fr) minmax(300px, 1fr)';

  const campaign = dataCache?.customer?.campaign || null;
  const deliveryConnection = campaign?.deliveryConnection;

  const handleSearchChange = (search: string) => {
    setFilter((prevValues) => ({
      ...prevValues,
      search,
      pageIndex: 0,
    }));
  };

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
          <UI.Div mb={2}>
            <PickerButton label={t('add_filter')} icon={(<Plus />)}>
              {() => (
                <TabbedMenu tabs={[{ label: t('search'), icon: <Search /> }]}>
                  <UI.Div>
                    <Searchbar
                      activeSearchTerm={filter.search}
                      onSearchTermChange={handleSearchChange}
                    />
                  </UI.Div>
                </TabbedMenu>
              )}
            </PickerButton>
          </UI.Div>
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
                <DeliveryRecipient delivery={delivery} />
              </Table.Cell>
              <Table.Cell>
                <DeliveryRecipientAdres delivery={delivery} />
              </Table.Cell>
              <Table.Cell>
                <Table.InnerCell>
                  <UI.Helper>
                    {delivery.campaignVariant?.label}
                  </UI.Helper>
                </Table.InnerCell>
              </Table.Cell>
              <Table.Cell>
                <DeliveryStatus delivery={delivery} />
              </Table.Cell>
            </Table.Row>
          ))}
        </UI.Div>

        <Table.Pagination
          pageIndex={filter.pageIndex}
          maxPages={totalPages}
          perPage={filter.perPage}
          isLoading={isLoading}
          setPageIndex={(page) => setFilter((newFilter) => ({ ...newFilter, pageIndex: page - 1 }))}
        />

        <UI.Modal isOpen={isOpenImportModal} onClose={() => setIsOpenImportModal(false)}>
          <UI.ModalCard maxWidth={1200} onClose={() => setIsOpenImportModal(false)}>
            <UI.ModalBody>
              <ImportDeliveriesForm
                onComplete={() => refetch()}
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
