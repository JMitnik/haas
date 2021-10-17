import * as UI from '@haas/ui';
import { Calendar, Plus, Search, Settings, User } from 'react-feather';
import { Route, Switch, useLocation } from 'react-router';
import { endOfDay, startOfDay } from 'date-fns';
import { union } from 'lodash';
import { useTranslation } from 'react-i18next';
import React, { useState } from 'react';

import * as Menu from 'components/Common/Menu';
import * as Table from 'components/Common/Table';
import { AnimatePresence, motion } from 'framer-motion';
import { BooleanParam, DateTimeParam, NumberParam, StringParam, useQueryParams, withDefault } from 'use-query-params';
import {
  DeliveryConnectionOrder, DeliveryFragmentFragment,
  DeliveryStatusEnum, GetWorkspaceCampaignQuery, useGetWorkspaceCampaignQuery,
} from 'types/generated-types';
import { DeliveryRecipient } from 'components/Campaign/DeliveryRecipient';
import { DeliveryRecipientAddress } from 'components/Campaign/DeliveryRecipientAddress';
import { DeliveryStatus } from 'components/Campaign/DeliveryStatus';
import { FormatTimestamp } from 'components/Common/DateAndTime';
import { PickerButton } from 'components/Common/Picker/PickerButton';
import { ROUTES, useNavigator } from 'hooks/useNavigator';
import { TabbedMenu } from 'components/Common/TabMenu';
import { formatSimpleDate } from 'utils/dateUtils';
import { useLogger } from 'hooks/useLogger';
import { useMenu } from 'components/Common/Menu/useMenu';
import CreateCampaignForm, { CampaignFormProps } from 'views/CampaignsView/CreateCampaignForm';
import Searchbar from 'components/SearchBar';

import { CampaignType } from './CampaignViewTypes';
import { DeliveryModalCard } from './DeliveryModalCard';
import { ImportDeliveriesForm } from './ImportDeliveriesForm';

const POLL_INTERVAL_SECONDS = 30;

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

  const { customerSlug, campaignId, getCampaignsPath, goToCampaignView, goToDeliveryView } = useNavigator();
  const campaignsPath = getCampaignsPath();

  const [filter, setFilter] = useQueryParams({
    startDate: DateTimeParam,
    endDate: DateTimeParam,
    search: StringParam,
    pageIndex: withDefault(NumberParam, 0),
    perPage: withDefault(NumberParam, 10),
    recipientEmail: StringParam,
    recipientPhone: StringParam,
    recipientFirstName: StringParam,
    recipientLastName: StringParam,
    status: StringParam,
    orderByField: withDefault(StringParam, DeliveryConnectionOrder.CreatedAt),
    orderByDescending: withDefault(BooleanParam, true),
  });

  // For tables we will consider data-caches.
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
        recipientEmail: filter.recipientEmail,
        recipientFirstName: filter.recipientFirstName,
        recipientLastName: filter.recipientLastName,
        recipientPhoneNumber: filter.recipientPhone,
        status: filter.status as DeliveryStatusEnum,
        orderBy: {
          by: filter.orderByField as DeliveryConnectionOrder,
          desc: filter.orderByDescending,
        },
      },
    },
    pollInterval: POLL_INTERVAL_SECONDS * 1000,
    errorPolicy: 'ignore',
    onCompleted: (completeData) => setDataCache(completeData),
    onError: (error) => logger.logError(error, {
      tags: { section: 'campaign' },
    }),
  });

  const totalPages = dataCache?.customer?.campaign?.deliveryConnection?.totalPages || 0;

  const columns = 'minmax(200px, 1fr) minmax(150px, 1fr) minmax(100px, 1fr) minmax(100px, 1fr) minmax(100px, 1fr)';

  const campaign = dataCache?.customer?.campaign || null;
  const deliveryConnection = campaign?.deliveryConnection;

  const handleSearchChange = (search: string) => {
    setFilter((prevValues) => ({
      ...prevValues,
      search,
      pageIndex: 0,
    }));
  };

  const handleDateChange = (dates: Date[] | null) => {
    if (dates) {
      const [newStartDate, newEndDate] = dates;
      setFilter({
        ...filter,
        startDate: startOfDay(newStartDate),
        endDate: endOfDay(newEndDate),
        pageIndex: 0,
      });
    } else {
      setFilter({
        ...filter,
        startDate: null,
        endDate: null,
        pageIndex: 0,
      });
    }
  };

  const handleSingleDateFilterChange = (day: Date) => {
    setFilter({
      ...filter,
      startDate: startOfDay(day),
      endDate: endOfDay(day),
      pageIndex: 0,
    });
  };

  const handleMultiDateFilterChange = (newStartDate?: Date, newEndDate?: Date) => {
    setFilter({
      ...filter,
      startDate: newStartDate,
      endDate: newEndDate,
      pageIndex: 0,
    });
  };

  const handleRecipientFirstName = (firstName?: string | null) => {
    setFilter({ recipientFirstName: firstName, pageIndex: 0 });
  };

  const handleRecipientLastName = (lastName?: string | null) => {
    setFilter({ recipientLastName: lastName, pageIndex: 0 });
  };

  const handleRecipientEmail = (email?: string | null) => {
    setFilter({ recipientEmail: email, pageIndex: 0 });
  };

  const handleRecipientPhone = (phone?: string | null) => {
    setFilter({ recipientPhone: phone, pageIndex: 0 });
  };

  const handleStatus = (status?: string | null) => {
    setFilter({ status, pageIndex: 0 });
  };

  const { openMenu, closeMenu, menuProps, activeItem } = useMenu<DeliveryFragmentFragment>();

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
            {t('settings')}
          </UI.Button>
        </UI.Flex>

      </UI.ViewHead>
      <UI.ViewBody>
        <UI.Div>
          <UI.Flex mb={2}>
            <PickerButton arrowBg="gray.50" label={t('add_filter')} icon={(<Plus />)}>
              {() => (
                <TabbedMenu
                  menuHeader={t('add_filter')}
                  tabs={[
                    { label: t('search'), icon: <Search /> },
                    { label: t('date'), icon: <Calendar /> },
                    { label: t('recipient'), icon: <User /> },
                  ]}
                >
                  <UI.Div>
                    <UI.RadioHeader>
                      {t('filter_by_search')}
                    </UI.RadioHeader>
                    <Searchbar
                      activeSearchTerm={filter.search}
                      onSearchTermChange={handleSearchChange}
                    />
                  </UI.Div>

                  <UI.Div>
                    <UI.RadioHeader>
                      {t('filter_by_date')}
                    </UI.RadioHeader>
                    <UI.SectionSubHeader>
                      {t('filter_by_updated_date_description')}
                    </UI.SectionSubHeader>
                    <UI.DatePicker
                      value={[filter.startDate, filter.endDate]}
                      onChange={handleDateChange}
                      range
                    />
                  </UI.Div>

                  <UI.Div>
                    <UI.Stack>
                      <UI.Div>
                        <UI.RadioHeader>
                          {t('filter_by_recipient_first_name')}
                        </UI.RadioHeader>
                        <Searchbar
                          activeSearchTerm={filter.recipientFirstName}
                          onSearchTermChange={handleRecipientFirstName}
                        />
                      </UI.Div>
                      <UI.Div>
                        <UI.RadioHeader>
                          {t('filter_by_recipient_last_name')}
                        </UI.RadioHeader>
                        <Searchbar
                          activeSearchTerm={filter.recipientLastName}
                          onSearchTermChange={handleRecipientLastName}
                        />
                      </UI.Div>
                      <UI.Div>
                        <UI.RadioHeader>
                          {t('filter_by_recipient_email')}
                        </UI.RadioHeader>
                        <Searchbar
                          activeSearchTerm={filter.recipientEmail}
                          onSearchTermChange={handleRecipientEmail}
                        />
                      </UI.Div>
                      <UI.Div>
                        <UI.RadioHeader>
                          {t('filter_by_recipient_phone')}
                        </UI.RadioHeader>
                        <Searchbar
                          activeSearchTerm={filter.recipientPhone}
                          onSearchTermChange={handleRecipientPhone}
                        />
                      </UI.Div>
                    </UI.Stack>
                  </UI.Div>
                </TabbedMenu>
              )}
            </PickerButton>

            <UI.Separator bg="gray.200" />

            <UI.Stack spacing={2} isInline>
              <Table.FilterButton
                condition={!!filter.search}
                filterKey="search"
                value={filter.search}
                onClose={() => handleSearchChange('')}
              />
              <Table.FilterButton
                condition={!!filter.recipientFirstName}
                filterKey="recipientFirstName"
                value={filter.recipientFirstName}
                onClose={() => handleRecipientFirstName('')}
              />
              <Table.FilterButton
                condition={!!filter.recipientLastName}
                filterKey="recipientLastName"
                value={filter.recipientLastName}
                onClose={() => handleRecipientLastName('')}
              />
              <Table.FilterButton
                condition={!!(filter.startDate || filter.endDate)}
                filterKey="updatedAt"
                value={`${formatSimpleDate(filter.startDate?.toISOString())} - ${formatSimpleDate(filter.endDate?.toISOString())}`}
                onClose={() => handleMultiDateFilterChange(undefined, undefined)}
              />
              <Table.FilterButton
                condition={!!filter.recipientEmail}
                filterKey="recipientEmail"
                value={filter.recipientEmail}
                onClose={() => handleRecipientEmail('')}
              />
              <Table.FilterButton
                condition={!!filter.recipientPhone}
                filterKey="recipientPhone"
                value={filter.recipientPhone}
                onClose={() => handleRecipientPhone('')}
              />
              <Table.FilterButton
                condition={!!filter.status}
                filterKey="status"
                value={filter.status}
                onClose={() => handleStatus(undefined)}
              />
            </UI.Stack>
          </UI.Flex>

          <UI.Div>
            <Menu.Base {...menuProps} onClose={closeMenu}>
              <Menu.Header>
                {t('filter')}
              </Menu.Header>
              <Menu.SubMenu label={(
                <UI.Flex>
                  <UI.Icon mr={1} width={10}>
                    <Calendar />
                  </UI.Icon>
                  {t('date')}
                </UI.Flex>
              )}
              >
                <Menu.Item
                  onClick={() => handleMultiDateFilterChange(undefined, new Date(activeItem?.updatedAt))}
                >
                  {t('before_day_of')}
                  {' '}
                  {formatSimpleDate(activeItem?.updatedAt)}
                </Menu.Item>
                <Menu.Item
                  onClick={() => handleSingleDateFilterChange(activeItem?.updatedAt)}
                >
                  {t('on_day_of')}
                  {' '}
                  {formatSimpleDate(activeItem?.updatedAt)}
                </Menu.Item>
                <Menu.Item
                  onClick={() => handleMultiDateFilterChange(new Date(activeItem?.updatedAt), undefined)}
                >
                  {t('after_day_of')}
                  {' '}
                  {formatSimpleDate(activeItem?.updatedAt)}
                </Menu.Item>
              </Menu.SubMenu>
              <Menu.SubMenu label={(
                <UI.Flex>
                  <UI.Icon mr={1} width={10}>
                    <User />
                  </UI.Icon>
                  {t('recipient')}
                </UI.Flex>
              )}
              >
                <Menu.Item
                  onClick={() => handleRecipientFirstName(activeItem?.deliveryRecipientFirstName)}
                >
                  Starting with
                  {' '}
                  {activeItem?.deliveryRecipientFirstName}
                </Menu.Item>
                <Menu.Item
                  onClick={() => handleRecipientLastName(activeItem?.deliveryRecipientLastName)}
                >
                  Ending with
                  {' '}
                  {activeItem?.deliveryRecipientLastName}
                </Menu.Item>
                {activeItem?.deliveryRecipientPhone && (
                  <Menu.Item
                    onClick={() => handleRecipientPhone(activeItem?.deliveryRecipientPhone)}
                  >
                    With phone number
                    {' '}
                    {activeItem?.deliveryRecipientPhone}
                  </Menu.Item>
                )}
                {activeItem?.deliveryRecipientEmail && (
                  <Menu.Item
                    onClick={() => handleRecipientEmail(activeItem?.deliveryRecipientEmail)}
                  >
                    With email
                    {' '}
                    {activeItem?.deliveryRecipientEmail}
                  </Menu.Item>
                )}
              </Menu.SubMenu>

              <Menu.Item
                onClick={() => handleStatus(activeItem?.currentStatus)}
              >
                With status
                {' '}
                <UI.Div ml={2}>
                  <DeliveryStatus onlyStatus delivery={activeItem as DeliveryFragmentFragment} />
                </UI.Div>
              </Menu.Item>
            </Menu.Base>

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
              <Table.HeadingCell>
                {t('last_update')}
              </Table.HeadingCell>
            </Table.HeadingRow>
            {deliveryConnection?.deliveries.map((delivery) => (
              <Table.Row
                onClick={() => goToDeliveryView(campaignId, delivery.id)}
                isLoading={isLoading}
                key={delivery.id}
                gridTemplateColumns={columns}
                onContextMenu={(e) => openMenu(e, delivery)}
              >
                <Table.Cell>
                  <DeliveryRecipient delivery={delivery} />
                </Table.Cell>
                <Table.Cell>
                  <DeliveryRecipientAddress delivery={delivery} />
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
                <Table.Cell>
                  <FormatTimestamp timestamp={delivery.updatedAt} />
                </Table.Cell>
              </Table.Row>
            ))}
          </UI.Div>
        </UI.Div>

        <UI.Flex justifyContent="flex-end">
          <Table.Pagination
            pageIndex={filter.pageIndex}
            maxPages={totalPages}
            perPage={filter.perPage}
            isLoading={isLoading}
            setPageIndex={(page) => setFilter((newFilter) => ({ ...newFilter, pageIndex: page - 1 }))}
          />
        </UI.Flex>

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
