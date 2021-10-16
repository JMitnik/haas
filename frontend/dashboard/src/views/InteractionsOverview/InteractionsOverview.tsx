/* eslint-disable @typescript-eslint/no-use-before-define */
/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable radix */
import '@szhsin/react-menu/dist/index.css';
import * as UI from '@haas/ui';
import { Activity, Calendar, Filter, Link2, Mail, MessageCircle, Plus, Search, Smartphone } from 'react-feather';
import { AnimatePresence, motion } from 'framer-motion';
import { BooleanParam, DateTimeParam, NumberParam, StringParam, useQueryParams, withDefault } from 'use-query-params';
import { Controller, useForm } from 'react-hook-form';
import { ErrorBoundary } from 'react-error-boundary';
import { Flex, ViewTitle } from '@haas/ui';
import {
  Icon,
  Radio,
  RadioGroup,
} from '@chakra-ui/core';
import { MenuHeader, MenuItem, SubMenu, useMenuState } from '@szhsin/react-menu';
import { ROUTES, useNavigator } from 'hooks/useNavigator';
import { Route, Switch, useLocation } from 'react-router';
import { endOfDay, format, startOfDay } from 'date-fns';
import { useTranslation } from 'react-i18next';
import React, { Dispatch, SetStateAction, useState } from 'react';
import styled from 'styled-components';

import * as Table from 'components/Common/Table';
import { Avatar } from 'components/Common/Avatar';
import {
  CampaignVariantEnum,
  SessionConnectionOrder,
  SessionDeliveryType, SessionFragmentFragment, useGetInteractionsQueryQuery,
} from 'types/generated-types';
import { Circle } from 'components/Common/Circle';
import {
  CompactEntriesPath,
} from 'views/DialogueView/Modules/InteractionFeedModule/InteractionFeedEntry';
import { DeliveryRecipient } from 'components/Campaign/DeliveryRecipient';
import { ReactComponent as IconClose } from 'assets/icons/icon-close.svg';
import { Menu } from 'components/Common/Menu/Menu';
import { PickerButton } from 'components/Common/Picker/PickerButton';
import { TabbedMenu } from 'components/Common/TabMenu';
import { formatSimpleDate } from 'utils/dateUtils';
import SearchBar from 'components/SearchBar/SearchBar';

import { InteractionModalCard } from './InteractionModalCard';

interface TableProps {
  search?: string | null;
  pageIndex?: number | null;
  perPage?: number | null;
  startDate?: Date | null;
  endDate?: Date | null;
  filterCampaigns?: SessionDeliveryType | 'all' | null;
  filterCampaignId?: string | 'all' | null;
}

const undefinedToNull = (value: any) => {
  if (value === undefined) {
    return 'all';
  }

  return value;
};

const AnonymousCell = ({ sessionId }: { sessionId: string }) => {
  const { t } = useTranslation();
  return (
    <UI.Flex alignItems="center">
      <UI.Div mr={2}>
        <Avatar name="A" brand="gray" />
      </UI.Div>
      <UI.ColumnFlex>
        <UI.Span fontWeight={600} color="gray.500">
          {t('anonymous')}
        </UI.Span>
        <UI.Span color="gray.400" fontSize="0.7rem">
          {sessionId}
        </UI.Span>
      </UI.ColumnFlex>
    </UI.Flex>
  );
};

const DateCell = ({ timestamp }: { timestamp: string }) => {
  const date = new Date(parseInt(timestamp, 10));

  const formattedDate = format(date, 'd MMM yyyy');
  const formattedTimestamp = format(date, 'HH:mm');

  return (
    <UI.ColumnFlex>
      <UI.Helper>{formattedDate}</UI.Helper>
      <UI.Span color="gray.400" fontWeight={600}>{formattedTimestamp}</UI.Span>
    </UI.ColumnFlex>
  );
};

interface FilterButtonProps {
  filterKey: string;
  value: string;
  onDisable: () => void;
}

const FilterButtonContainer = styled(UI.Div)`
  font-weight: 600;
  line-height: 1rem;
  font-size: 0.6rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  background: white;
  box-shadow: 0 4px 6px rgba(50,50,93,.11), 0 1px 3px rgba(0,0,0,.08);
  border-radius: 10px;
  padding: 4px 8px;
  display: flex;
  align-items: center;

  button {
    margin-left: 10px;
    max-width: 20px !important;
    max-height: 20px;

    min-width: auto;
    min-height: auto;

    svg {
      width: 80%;
      height: 100%;
    }
  }
`;

interface DistributionInnerCellProps {
  session: SessionFragmentFragment;
}

const DistributionInnerCell = ({ session }: DistributionInnerCellProps) => {
  const { goToCampaignView } = useNavigator();

  return (

    <UI.Div>
      {session.delivery ? (
        <Table.InnerCell
          header="Origin"
          renderBody={() => (
            <>
              <UI.Stack spacing={1}>
                <UI.Stack isInline>
                  <UI.Text>Url:</UI.Text>
                  <UI.Muted>
                    <UI.Span fontSize="0.7rem">
                      {session.originUrl}
                    </UI.Span>
                  </UI.Muted>
                </UI.Stack>
                <UI.Div>
                  <UI.Stack isInline>
                    <UI.Text>Campaign:</UI.Text>
                    <UI.Div>
                      <UI.Muted>
                        <UI.Span fontSize="0.7rem">
                          {session.delivery?.campaignVariant?.campaign?.label}
                        </UI.Span>
                      </UI.Muted>
                      {!!session.delivery?.campaignVariant?.campaign?.id && (
                        <UI.Button
                          size="xs"
                          onClick={
                            () => goToCampaignView(session.delivery?.campaignVariant?.campaign?.id || '')
                          }
                        >
                          View campaign
                        </UI.Button>
                      )}
                    </UI.Div>
                  </UI.Stack>
                </UI.Div>
                <UI.Stack isInline alignItems="center">
                  <UI.Text>Campaign variant:</UI.Text>
                  <UI.Muted>
                    <UI.Span fontSize="0.7rem">
                      {session.delivery?.campaignVariant?.label}
                      {' - '}
                      {session.delivery?.campaignVariant?.type}
                    </UI.Span>
                  </UI.Muted>
                </UI.Stack>
              </UI.Stack>
            </>
          )}
        >
          <UI.Flex>
            <UI.Div>
              {session.delivery.campaignVariant?.type === CampaignVariantEnum.Email ? (
                <Circle flexShrink={0} brand="blue" mr={2}>
                  <UI.Icon>
                    <Smartphone />
                  </UI.Icon>
                </Circle>
              ) : (
                <Circle flexShrink={0} brand="blue" mr={2}>
                  <UI.Icon>
                    <Mail />
                  </UI.Icon>
                </Circle>
              )}
            </UI.Div>
            <UI.Div>
              <UI.Helper color="blue.500">
                Campaign:
                {' '}
                {session.delivery.campaignVariant?.campaign?.label}
              </UI.Helper>
              <UI.Flex>
                <UI.Muted>
                  {session.originUrl}
                </UI.Muted>
              </UI.Flex>
            </UI.Div>
          </UI.Flex>
        </Table.InnerCell>
      ) : (
        <>
          <Table.InnerCell>
            <UI.Div>
              <UI.Flex>
                <Circle flexShrink={0} brand="gray" mr={2}>
                  <UI.Icon>
                    <Link2 />
                  </UI.Icon>
                </Circle>
                <UI.Div>
                  <UI.Helper color="gray.500">Link click</UI.Helper>
                  <UI.Muted>
                    {session.originUrl}
                  </UI.Muted>
                </UI.Div>
              </UI.Flex>
            </UI.Div>
          </Table.InnerCell>
        </>
      )}
    </UI.Div>
  );
};

const FilterButton = ({ filterKey, value, onDisable }: FilterButtonProps) => (
  <FilterButtonContainer>
    {filterKey}
    :
    {' '}
    {value}
    <UI.IconButton
      aria-label="close"
      icon={IconClose}
      onClick={onDisable}
      width={10}
      minWidth={10}
    />
  </FilterButtonContainer>
);

const ActiveFilters = ({
  filter,
  setFilters,
}: { filter: TableProps, setFilters: Dispatch<SetStateAction<TableProps>> }) => (
  <UI.Stack isInline spacing={2} alignItems="center">
    {!!filter.search && (
      <UI.Div>
        <FilterButton
          filterKey="search"
          value={filter.search}
          onDisable={() => setFilters((newFilter) => ({ ...newFilter, search: '' }))}
        />
      </UI.Div>
    )}
    {(filter.startDate || filter.endDate) && (
      <UI.Div>
        <ErrorBoundary fallbackRender={() => <></>}>
          <FilterButton
            filterKey="date"
            value={`${formatSimpleDate(filter.startDate?.toISOString())} - ${formatSimpleDate(filter.endDate?.toISOString())}`}
            onDisable={() => setFilters((newFilter) => ({ ...newFilter, startDate: undefined, endDate: undefined }))}
          />
        </ErrorBoundary>
      </UI.Div>
    )}
    {!!filter.filterCampaigns && (
      <UI.Div>
        <FilterButton
          filterKey="distribution"
          value={filter.filterCampaigns}
          onDisable={() => setFilters((newFilter) => ({ ...newFilter, filterCampaigns: undefined }))}
        />
      </UI.Div>
    )}
    {!!filter.filterCampaignId && (
      <UI.Div>
        <FilterButton
          filterKey="campaignVariant"
          value={filter.filterCampaignId}
          onDisable={() => setFilters((newFilter) => ({ ...newFilter, filterCampaignId: undefined }))}
        />
      </UI.Div>
    )}
  </UI.Stack>
);

interface CampaignVariant {
  id: string;
  label: string;
  campaign?: {
    id: string;
    label: string;
  } | null;
}

export const InteractionsOverview = () => {
  const { t } = useTranslation();
  const { customerSlug, dialogueSlug, goToInteractionsView } = useNavigator();
  const location = useLocation();

  const [campaignVariants, setCampaignVariants] = useState<CampaignVariant[]>([]);
  const [sessions, setSessions] = useState<SessionFragmentFragment[]>(() => []);

  const [filter, setFilter] = useQueryParams({
    startDate: DateTimeParam,
    endDate: DateTimeParam,
    search: StringParam,
    pageIndex: withDefault(NumberParam, 0),
    perPage: withDefault(NumberParam, 10),
    filterCampaigns: StringParam,
    filterCampaignId: StringParam,
    orderByField: withDefault(StringParam, SessionConnectionOrder.CreatedAt),
    orderByDescending: withDefault(BooleanParam, true),
  });
  const [totalPages, setTotalPages] = useState<number>(0);

  const { loading: isLoading } = useGetInteractionsQueryQuery({
    fetchPolicy: 'cache-and-network',
    variables: {
      customerSlug,
      dialogueSlug,
      sessionsFilter: {
        offset: filter.pageIndex * filter.perPage,
        startDate: filter.startDate ? filter.startDate?.toISOString() : undefined,
        perPage: filter.perPage,
        endDate: filter.endDate ? filter.endDate?.toISOString() : undefined,
        orderBy: {
          by: filter.orderByField as SessionConnectionOrder,
          desc: filter.orderByDescending,
        },
        search: filter.search,
        deliveryType: filter.filterCampaigns === 'all' ? undefined : filter.filterCampaigns as SessionDeliveryType,
        campaignVariantId: filter.filterCampaignId === 'all' ? undefined : filter.filterCampaignId,
      },
    },
    errorPolicy: 'ignore',
    onCompleted: (fetchedData) => {
      setCampaignVariants(
        fetchedData?.customer?.dialogue?.campaignVariants || [],
      );

      setSessions(
        fetchedData?.customer?.dialogue?.sessionConnection?.sessions || [],
      );

      setTotalPages(fetchedData.customer?.dialogue?.sessionConnection?.totalPages || 0);
    },
  });

  const handleCampaignVariantFilterChange = (filterValues: CampaignVariantFormProps) => {
    setFilter({
      ...filter,
      filterCampaigns: filterValues.filterCampaigns as SessionDeliveryType,
      filterCampaignId: filterValues.filterCampaignVariant,
      pageIndex: 0,
    });
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

  const handleSearchTermChange = (search: string) => {
    setFilter((prevValues) => ({
      ...prevValues,
      search,
      pageIndex: 0,
    }));
  };
  const { toggleMenu, ...menuProps } = useMenuState();
  const [anchorPoint, setAnchorPoint] = useState({ x: 0, y: 0 });
  const [contextInteraction, setContextInteraction] = useState<SessionFragmentFragment>();

  const columns = 'minmax(200px, 1fr) minmax(150px, 1fr) minmax(300px, 1fr) minmax(300px, 1fr)';

  return (
    <>
      <UI.ViewHead>
        <UI.Flex alignItems="center" justifyContent="space-between" width="100%">
          <UI.Flex alignItems="center">
            <ViewTitle>
              <Icon as={Activity} mr={1} />
              {t('views:interactions_view')}
            </ViewTitle>
          </UI.Flex>

          <Flex alignItems="center">
            <SearchBar
              activeSearchTerm={filter.search}
              onSearchTermChange={handleSearchTermChange}
            />
          </Flex>
        </UI.Flex>
      </UI.ViewHead>

      <UI.ViewBody>
        <UI.Flex mb={2} justifyContent="flex-start">
          <UI.Stack isInline spacing={2} alignItems="center">
            <PickerButton arrowBg="gray.50" label={t('add_filter')} icon={<Plus />}>
              {() => (
                <TabbedMenu
                  menuHeader={t('add_filter')}
                  tabs={[
                    { label: t('search'), icon: <Search /> },
                    { label: t('date'), icon: <Calendar /> },
                    { label: t('origin'), icon: <MessageCircle /> },
                  ]}
                >
                  <UI.Div id="searchFilter">
                    <UI.Stack>
                      <UI.RadioHeader>
                        {t('filter_by_search')}
                      </UI.RadioHeader>
                      <UI.Div mb={1}>
                        <UI.Muted>{t('filter_by_search_helper')}</UI.Muted>
                      </UI.Div>
                      <SearchBar
                        activeSearchTerm={filter.search}
                        onSearchTermChange={handleSearchTermChange}
                      />
                    </UI.Stack>
                  </UI.Div>

                  <UI.Div id="dateFilter">
                    <UI.Stack spacing={2}>
                      <UI.RadioHeader>
                        {t('filter_by_date')}
                      </UI.RadioHeader>
                      <UI.Div mb={1}>
                        <UI.Muted>{t('show_interactions_between')}</UI.Muted>
                      </UI.Div>
                      <UI.Div>
                        <UI.DatePicker
                          value={[filter.startDate, filter.endDate]}
                          onChange={handleDateChange}
                          range
                        />
                      </UI.Div>
                      <UI.Button size="sm" onClick={() => handleDateChange(null)}>{t('reset')}</UI.Button>
                    </UI.Stack>
                  </UI.Div>
                  <UI.Div id="campaignFilter">
                    <UI.Stack>
                      <FilterByCampaignForm
                        defaultValues={{
                          filterCampaignVariant: undefinedToNull(filter.filterCampaignId),
                          filterCampaigns: undefinedToNull(filter.filterCampaigns),
                        }}
                        campaignVariants={campaignVariants}
                        onApply={handleCampaignVariantFilterChange}
                      />
                    </UI.Stack>
                  </UI.Div>
                </TabbedMenu>
              )}
            </PickerButton>

            <UI.Separator bg="gray.200" />

            {/* @ts-ignore */}
            <ActiveFilters filter={filter} setFilters={setFilter} />

          </UI.Stack>
        </UI.Flex>
        <UI.Flex mb={4} justifyContent="flex-end">
          {/* @ts-ignore */}
        </UI.Flex>
        <UI.Div width="100%">
          <Table.HeadingRow gridTemplateColumns={columns}>
            <Table.HeadingCell>
              {t('user')}
            </Table.HeadingCell>
            <Table.HeadingCell>
              {t('interaction')}
            </Table.HeadingCell>
            <Table.HeadingCell>
              {t('origin')}
            </Table.HeadingCell>
            <Table.HeadingCell
              sorting
              descending={filter.orderByDescending || false}
              onDescendChange={(isDescend) => setFilter({ orderByDescending: isDescend })}
            >
              {t('when')}
            </Table.HeadingCell>
          </Table.HeadingRow>
          <UI.Div>
            <Menu
              {...menuProps}
              anchorPoint={anchorPoint}
              onClose={() => toggleMenu(false)}
            >
              <MenuHeader>
                <UI.Icon>
                  <Filter />
                </UI.Icon>
                {t('filter')}
              </MenuHeader>
              <SubMenu label={(
                <UI.Flex>
                  <UI.Icon mr={1} width={10}>
                    <Calendar />
                  </UI.Icon>
                  {t('date')}
                </UI.Flex>
              )}
              >
                <MenuItem
                  onClick={() => handleMultiDateFilterChange(undefined, new Date(contextInteraction?.createdAt))}
                >
                  {t('before_day_of')}
                  {' '}
                  {formatSimpleDate(contextInteraction?.createdAt)}
                </MenuItem>
                <MenuItem
                  onClick={() => handleSingleDateFilterChange(contextInteraction?.createdAt)}
                >
                  {t('on_day_of')}
                  {' '}
                  {formatSimpleDate(contextInteraction?.createdAt)}
                </MenuItem>
                <MenuItem
                  onClick={() => handleMultiDateFilterChange(new Date(contextInteraction?.createdAt), undefined)}
                >
                  {t('after_day_of')}
                  {' '}
                  {formatSimpleDate(contextInteraction?.createdAt)}
                </MenuItem>
              </SubMenu>
              {contextInteraction?.delivery && (
                <>
                  <SubMenu label={(
                    <UI.Flex>
                      <UI.Icon mr={1} width={10}>
                        <MessageCircle />
                      </UI.Icon>
                      {t('campaign')}
                    </UI.Flex>
                  )}
                  >
                    <MenuItem
                      onClick={() => handleSearchTermChange(
                        `${contextInteraction?.delivery?.deliveryRecipientFirstName} ${contextInteraction?.delivery?.deliveryRecipientLastName}` || '',
                      )}
                    >
                      {t('more_from')}
                      {' '}
                      {contextInteraction?.delivery?.deliveryRecipientFirstName}
                      {' '}
                      {contextInteraction?.delivery?.deliveryRecipientLastName}
                    </MenuItem>
                    <MenuItem onClick={() => handleCampaignVariantFilterChange({
                      filterCampaignVariant: contextInteraction?.delivery?.campaignVariant?.id,
                    })}
                    >
                      {t('more_from')}
                      {' '}
                      {t('campaign_variant')}
                      {' '}
                      {contextInteraction?.delivery?.campaignVariant?.label}
                    </MenuItem>
                  </SubMenu>
                </>
              )}
            </Menu>

            {sessions.map((session) => (
              <Table.Row
                onClick={() => goToInteractionsView(session.id)}
                gridTemplateColumns={columns}
                key={session.id}
                onContextMenu={(e) => {
                  e.preventDefault();
                  setAnchorPoint({ x: e.clientX, y: e.clientY });
                  setContextInteraction(session);
                  toggleMenu(true);
                }}
              >
                <Table.Cell>
                  {session.delivery?.deliveryRecipientFirstName ? (
                    <DeliveryRecipient delivery={session.delivery} />
                  ) : (
                    <AnonymousCell sessionId={session.id} />
                  )}
                </Table.Cell>
                <Table.Cell>
                  {/* @ts-ignore */}
                  <CompactEntriesPath nodeEntries={session.nodeEntries} />
                </Table.Cell>
                <Table.Cell>
                  <DistributionInnerCell session={session} />
                </Table.Cell>
                <Table.Cell>
                  <DateCell timestamp={session.createdAt} />
                </Table.Cell>
              </Table.Row>
            ))}
          </UI.Div>
          <UI.Flex justifyContent="flex-end" mt={4}>
            {totalPages > 1 && (
              <Table.Pagination
                pageIndex={filter.pageIndex}
                maxPages={totalPages}
                perPage={filter.perPage}
                isLoading={isLoading}
                setPageIndex={(page) => setFilter((newFilter) => ({ ...newFilter, pageIndex: page - 1 }))}
              />
            )}
          </UI.Flex>
        </UI.Div>

        <AnimatePresence>
          <Switch
            location={location}
            key={location.pathname}
          >
            <Route
              path={ROUTES.INTERACTION_VIEW}
            >
              {({ match }) => (
                <motion.div
                  key={location.pathname}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <UI.Modal isOpen onClose={() => goToInteractionsView()}>
                    <InteractionModalCard
                      onClose={() => goToInteractionsView()}
                      // @ts-ignore
                      sessionId={match?.params?.interactionId}
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

interface CampaignVariantFormProps {
  filterCampaigns?: string;
  filterCampaignVariant?: string;
}

interface FilterByCampaignFormProps {
  defaultValues: CampaignVariantFormProps;
  campaignVariants: CampaignVariant[];
  onApply: (filterValues: CampaignVariantFormProps) => void;
}

const FilterByCampaignForm = ({ defaultValues, campaignVariants, onApply }: FilterByCampaignFormProps) => {
  const { t } = useTranslation();
  const form = useForm<CampaignVariantFormProps>({
    defaultValues: {
      filterCampaignVariant: defaultValues.filterCampaignVariant,
      filterCampaigns: defaultValues.filterCampaigns as SessionDeliveryType,
    },
  });

  const filterCampaignWatch = form.watch('filterCampaigns');

  const handleSubmit = () => {
    onApply(form.getValues());
    form.reset(form.getValues());
  };

  return (
    <UI.Form onSubmit={form.handleSubmit(handleSubmit)}>
      <UI.Stack>
        <UI.Div>
          <UI.RadioHeader>
            {t('filter_by_origin_type')}
          </UI.RadioHeader>
          <Controller
            control={form.control}
            name="filterCampaigns"
            defaultValue={defaultValues.filterCampaigns}
            render={({ onChange, value }) => (
              <RadioGroup size="sm" onChange={onChange} value={value}>
                <Radio value="all" mb={0}>All</Radio>
                <Radio value={SessionDeliveryType.Campaigns} mb={0}>Only campaigns</Radio>
                <Radio value={SessionDeliveryType.NoCampaigns} mb={0}>Only link-clicks</Radio>
              </RadioGroup>
            )}
          />

          {filterCampaignWatch !== SessionDeliveryType.NoCampaigns && (
            <UI.Div mt={2}>
              <UI.RadioHeader>
                Pick campaigns
              </UI.RadioHeader>
              <Controller
                control={form.control}
                name="filterCampaignVariant"
                defaultValue={defaultValues.filterCampaignVariant}
                render={({ onChange, value }) => (
                  <RadioGroup size="sm" onChange={onChange} value={value}>
                    <Radio value="all" mb={0}>All</Radio>
                    {campaignVariants.map((variant) => (
                      <Radio key={variant.id} value={variant.id} mb={0}>
                        {variant?.campaign?.label}
                        {' '}
                        -
                        {' '}
                        {variant.label}
                      </Radio>
                    ))}
                  </RadioGroup>
                )}
              />
            </UI.Div>
          )}
        </UI.Div>

        <UI.Button
          isDisabled={!form.formState.isDirty}
          type="submit"
          variantColor="teal"
          size="sm"
          mb={4}
        >
          Apply filters
        </UI.Button>
      </UI.Stack>
    </UI.Form>
  );
};
