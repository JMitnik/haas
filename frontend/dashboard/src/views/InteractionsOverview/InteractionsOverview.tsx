/* eslint-disable @typescript-eslint/no-use-before-define */
/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable radix */
import '@szhsin/react-menu/dist/index.css';
import * as UI from '@haas/ui';
import { Activity, Calendar, Filter, Link2, Mail, MessageCircle, Smartphone } from 'react-feather';
import { AnimatePresence, motion } from 'framer-motion';
import { BooleanParam, DateTimeParam, NumberParam, StringParam, useQueryParams, withDefault } from 'use-query-params';
import { Controller, useForm } from 'react-hook-form';
import { ErrorBoundary } from 'react-error-boundary';
import { Flex, ViewTitle } from '@haas/ui';
import {
  Icon,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger,
  Radio,
  RadioGroup,
  useDisclosure,
} from '@chakra-ui/core';
import { MenuHeader, MenuItem, SubMenu, useMenuState } from '@szhsin/react-menu';
import { ROUTES, useNavigator } from 'hooks/useNavigator';
import { Route, Switch, useHistory, useLocation } from 'react-router';
import { endOfDay, format, startOfDay } from 'date-fns';
import { useTranslation } from 'react-i18next';
import React, { Dispatch, SetStateAction, useEffect, useRef, useState } from 'react';
import styled, { css } from 'styled-components';

import {
  CampaignVariantEnum,
  DeliveryFragmentFragment,
  SessionConnectionOrder,
  SessionDeliveryType, SessionFragmentFragment, useGetInteractionsQueryQuery,
} from 'types/generated-types';
import {
  CompactEntriesPath,
} from 'views/DialogueView/Modules/InteractionFeedModule/InteractionFeedEntry';
import { ReactComponent as IconClose } from 'assets/icons/icon-close.svg';
import { ReactComponent as IconSortDown } from 'assets/icons/icon-cheveron-down.svg';
import { ReactComponent as IconSortUp } from 'assets/icons/icon-cheveron-up.svg';
import { Menu } from 'components/Common/Menu/Menu';
import { formatSimpleDate } from 'utils/dateUtils';
import { paginate } from 'utils/paginate';
import SearchBar from 'components/SearchBar/SearchBar';
import useDebouncedEffect from 'hooks/useDebouncedEffect';

import { Circle } from 'components/Common/Circle';
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

const AvatarContainer = styled(UI.Flex)`
  box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1),0 2px 4px -1px rgba(0,0,0,0.06);
`;

const undefinedToNull = (value: any) => {
  if (value === undefined) {
    return 'all';
  }

  return value;
};

const Avatar = ({ name, brand }: { name: string, brand: string }) => {
  const firstLetter = name.slice(0, 1);

  return (
    <AvatarContainer
      alignItems="center"
      justifyContent="center"
      bg={`${brand}.100`}
      width="30px"
      height="30px"
      color={`${brand}.600`}
      borderRadius="10px"
    >
      <UI.Span fontWeight="600">
        {firstLetter}
      </UI.Span>
    </AvatarContainer>
  );
};

const DeliveryUserCell = ({ delivery }: { delivery: DeliveryFragmentFragment }) => (
  <UI.Flex alignItems="center">
    <UI.Div mr={2}>
      {delivery.deliveryRecipientFirstName && (
        <Avatar name={delivery.deliveryRecipientFirstName} brand="blue" />
      )}
    </UI.Div>
    <UI.ColumnFlex>
      <UI.Span fontWeight={600} color="blue.500">
        {delivery.deliveryRecipientFirstName}
        {' '}
        {delivery.deliveryRecipientLastName}
      </UI.Span>
      <UI.Span color="blue.300" fontSize="0.7rem">
        {delivery.id}
      </UI.Span>
    </UI.ColumnFlex>
  </UI.Flex>
);

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

const TableCellButtonContainer = styled(UI.Div)`
  transition: all ease-in 0.2s;
  text-align: left;

  &:hover {
    transition: all ease-in 0.2s;
    box-shadow: 0 4px 6px rgba(50,50,93,.07), 0 1px 3px rgba(0,0,0,.03);
  }
`;

const TableCellButton = ({
  children,
  renderBody
}: { children: React.ReactNode, renderBody?: () => React.ReactNode }) => (
  <UI.Div onClick={(e) => e.stopPropagation()}>
    <Popover usePortal>
      <PopoverTrigger>
        <TableCellButtonContainer
          as="button"
          py={1}
          px={2}
          borderRadius={10}
          border="1px solid"
          borderColor="gray.100"
        >
          {children}
        </TableCellButtonContainer>
      </PopoverTrigger>
      <PopoverContent
        borderRadius={10}
        borderWidth={1}
        borderColor="gray.300"
        py={1}
        px={2}
        boxShadow="0 4px 6px rgba(50,50,93,.11), 0 1px 3px rgba(0,0,0,.08) !important"
      >
        <PopoverArrow borderColor="gray.300" />
        <PopoverBody>
          {renderBody?.()}
        </PopoverBody>
      </PopoverContent>
    </Popover>
  </UI.Div>
);

const DistributionInnerCell = ({ session }: DistributionInnerCellProps) => {
  const { goToCampaignView } = useNavigator();

  return (

    <UI.Div>
      {session.delivery ? (
        <TableCellButton renderBody={() => (
          <>
            <UI.Helper>Origin</UI.Helper>
            <UI.Stack spacing={1}>
              <UI.Stack isInline alignItems="center">
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
                          () => goToCampaignView(session.delivery?.campaignVariant?.campaign?.id)
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
                <Circle brand="blue" mr={2}>
                  <UI.Icon>
                    <Smartphone />
                  </UI.Icon>
                </Circle>
              ) : (
                <Circle brand="blue" mr={2}>
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
                {session.delivery.campaignVariant?.label}
              </UI.Helper>
              <UI.Flex>
                <UI.Muted>
                  {session.originUrl}
                </UI.Muted>
              </UI.Flex>
            </UI.Div>
          </UI.Flex>
        </TableCellButton>
      ) : (
        <>
          <TableCellButton>
            <UI.Div>
              <UI.Flex>
                <Circle brand="gray" mr={2}>
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
          </TableCellButton>
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

  const handleDateChange = (dates: Date[]) => {
    if (dates) {
      const [newStartDate, newEndDate] = dates;
      setFilter({
        ...filter,
        startDate: startOfDay(newStartDate),
        endDate: endOfDay(newEndDate),
      });
    } else {
      setFilter({
        ...filter,
        startDate: null,
        endDate: null,
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
        <UI.Flex mb={2} justifyContent="flex-end">
          <UI.Stack isInline spacing={2} alignItems="center">
            <UI.Div>
              <UI.DatePicker
                value={[filter.startDate, filter.endDate]}
                onChange={handleDateChange}
                range
              />
            </UI.Div>

            <CampaignVariantPicker
              defaultValues={{
                filterCampaignVariant: undefinedToNull(filter.filterCampaignId),
                filterCampaigns: undefinedToNull(filter.filterCampaigns),
              }}
              campaignVariants={campaignVariants}
              onApply={handleCampaignVariantFilterChange}
            />
          </UI.Stack>
        </UI.Flex>
        <UI.Flex mb={4} justifyContent="flex-end">
          {/* @ts-ignore */}
          <ActiveFilters filter={filter} setFilters={setFilter} />
        </UI.Flex>
        <UI.Div width="100%">
          <TableHeadingRow gridTemplateColumns="1fr 1fr 1fr 1fr">
            <TableHeadingCell>
              {t('user')}
            </TableHeadingCell>
            <TableHeadingCell>
              {t('interaction')}
            </TableHeadingCell>
            <TableHeadingCell>
              {t('origin')}
            </TableHeadingCell>
            <TableHeadingCell
              sorting
              descending={filter.orderByDescending || false}
              onDescendChange={(isDescend) => setFilter({ orderByDescending: isDescend })}
            >
              {t('when')}
            </TableHeadingCell>
          </TableHeadingRow>
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
              <TableRow
                onClick={() => goToInteractionsView(session.id)}
                gridTemplateColumns="1fr 1fr 1fr 1fr"
                key={session.id}
                onContextMenu={(e) => {
                  e.preventDefault();
                  setAnchorPoint({ x: e.clientX, y: e.clientY });
                  setContextInteraction(session);
                  toggleMenu(true);
                }}
              >
                <TableCell>
                  {session.delivery?.deliveryRecipientFirstName ? (
                    <DeliveryUserCell delivery={session.delivery} />
                  ) : (
                    <AnonymousCell sessionId={session.id} />
                  )}
                </TableCell>
                <TableCell>
                  {/* @ts-ignore */}
                  <CompactEntriesPath nodeEntries={session.nodeEntries} />
                </TableCell>
                <TableCell>
                  <DistributionInnerCell session={session} />
                </TableCell>
                <TableCell>
                  <DateCell timestamp={session.createdAt} />
                </TableCell>
              </TableRow>
            ))}
          </UI.Div>
          <UI.Flex justifyContent="flex-end" mt={4}>
            {totalPages > 1 && (
              <Pagination
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

interface PaginationProps {
  pageIndex: number;
  maxPages: number;
  perPage: number;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  setPageIndex: (page: number) => void;
  isLoading: boolean;
}

const PaginationContainer = styled(UI.Div)`
  box-shadow: 0 4px 6px rgba(50,50,93,.11), 0 1px 3px rgba(0,0,0,.08);
  display: inline-block;
  border-radius: 10px;
`;

const Pagination = ({
  pageIndex,
  maxPages,
  perPage,
  setPageIndex,
  isLoading,
}: PaginationProps) => {
  const { t } = useTranslation();
  const { pages } = paginate(maxPages, pageIndex + 1, perPage, 5);
  const startedRef = useRef<boolean>(false);
  const [inputPageIndex, setInputPageIndex] = useState(1);

  useDebouncedEffect(() => {
    if (startedRef.current) {
      startedRef.current = false;
      setPageIndex(Math.max(1, Number(inputPageIndex)));
    }
  }, 500, [inputPageIndex]);

  useEffect(() => {
    if (!startedRef.current) {
      startedRef.current = false;
      setInputPageIndex(pageIndex + 1);
    }
  }, [pageIndex, setInputPageIndex]);

  return (
    <PaginationContainer bg="white" padding={2}>
      <UI.Flex alignItems="center">
        <UI.Div mr={2}>
          {t('page')}
          {' '}
          {pageIndex + 1}
          {' '}
          {t('out_of')}
          {' '}
          {maxPages}
        </UI.Div>
        <UI.Input
          type="number"
          value={inputPageIndex}
          width={40}
          // @ts-ignore
          onChange={(e) => { startedRef.current = true; setInputPageIndex(e.target.value); }}
        />
        {pages.length > 1 && (
          <>
            <UI.Stack spacing={2} isInline ml={2}>
              {pages.map((page) => (
                <UI.Button
                  size="sm"
                  variantColor="teal"
                  isActive={page - 1 === pageIndex}
                  key={page}
                  isDisabled={isLoading}
                  onClick={() => setPageIndex(page)}
                >
                  {page}
                </UI.Button>
              ))}
            </UI.Stack>
          </>
        )}

      </UI.Flex>
    </PaginationContainer>
  );
};
interface PickerContainerProps {
  isActive?: boolean;
}

const PickerContainer = styled(UI.Div) <PickerContainerProps>`
  ${({ theme, isActive }) => css`
    display: flex;
    align-items: center;
    background: white;
    border-radius: 10px;
    box-shadow: 0 4px 6px rgba(50,50,93,.11), 0 1px 3px rgba(0,0,0,.08);
    border: none;
    padding: 6px 10px;
    font-weight: 700;
    color: ${theme.colors.gray[500]};

    ${UI.Span} {
      padding-right: ${theme.gutter / 3}px;
    }

    ${UI.Icon} {
      padding-left: ${theme.gutter / 3}px;
      border-left: 1px solid ${theme.colors.gray[200]};
      color: ${theme.colors.gray[500]};

      ${isActive && css`
        color: ${theme.colors.blue[500]};
      `}
    }
  `}
`;

interface CampaignVariantFormProps {
  filterCampaigns?: string;
  filterCampaignVariant?: string;
}

interface CampaignVariantPickerProps {
  defaultValues: CampaignVariantFormProps;
  campaignVariants: CampaignVariant[];
  onApply: (filterValues: CampaignVariantFormProps) => void;
}

const CampaignVariantPicker = ({ defaultValues, campaignVariants, onApply }: CampaignVariantPickerProps) => {
  const { onOpen, onClose, isOpen } = useDisclosure();

  const handleSave = (filterValues: CampaignVariantFormProps) => {
    onApply(filterValues);
    onClose();
  };

  const isActive = defaultValues.filterCampaignVariant !== 'all' || defaultValues.filterCampaigns !== 'all';

  return (
    <Popover
      usePortal
      isOpen={isOpen}
      onOpen={onOpen}
      closeOnBlur={false}
      onClose={onClose}
    >
      <PopoverTrigger>
        <PickerContainer isActive={isActive}>
          <UI.Span>
            Filter campaigns
          </UI.Span>
          <UI.Icon>
            <Filter />
          </UI.Icon>
        </PickerContainer>
      </PopoverTrigger>
      <PopoverContent
        zIndex={300}
        borderWidth={0}
        borderRadius={10}
        boxShadow="0 4px 6px rgba(50,50,93,.11), 0 1px 3px rgba(0,0,0,.08) !important"
      >
        <PopoverHeader>
          <UI.Helper>
            Filter campaigns
          </UI.Helper>
        </PopoverHeader>
        <PopoverCloseButton />

        <FilterByCampaignForm
          defaultValues={defaultValues}
          onApply={handleSave}
          campaignVariants={campaignVariants}
        />
      </PopoverContent>
    </Popover>
  );
};

interface FilterByCampaignFormProps {
  defaultValues: CampaignVariantFormProps;
  campaignVariants: CampaignVariant[];
  onApply: (filterValues: CampaignVariantFormProps) => void;
}

const FilterByCampaignForm = ({ defaultValues, campaignVariants, onApply }: FilterByCampaignFormProps) => {
  const form = useForm<CampaignVariantFormProps>({
    defaultValues: {
      filterCampaignVariant: defaultValues.filterCampaignVariant,
      filterCampaigns: defaultValues.filterCampaigns as SessionDeliveryType,
    },
  });

  const filterCampaignWatch = form.watch('filterCampaigns');

  const handleSubmit = () => {
    onApply(form.getValues());
  };

  return (
    <UI.Form onSubmit={form.handleSubmit(handleSubmit)}>
      <UI.Div py={2} px={2}>
        Filter campaign types
        <Controller
          control={form.control}
          name="filterCampaigns"
          defaultValue={defaultValues.filterCampaigns}
          render={({ onChange, value }) => (
            <RadioGroup size="sm" onChange={onChange} value={value}>
              <Radio value="all" mb={0}>All</Radio>
              <Radio value={SessionDeliveryType.Campaigns} mb={0}>Only campaigns</Radio>
              <Radio value={SessionDeliveryType.NoCampaigns} mb={0}>Only non-campaigns</Radio>
            </RadioGroup>
          )}
        />

        {filterCampaignWatch !== SessionDeliveryType.NoCampaigns && (
          <UI.Div mt={2}>
            Pick campaign
            <Controller
              control={form.control}
              name="filterCampaignVariant"
              defaultValue={defaultValues.filterCampaignVariant}
              render={({ onChange, value }) => (
                <RadioGroup size="sm" onChange={onChange} value={value}>
                  <Radio value="all" mb={0}>All</Radio>
                  {campaignVariants.map((variant) => (
                    <Radio key={variant.id} value={variant.id} mb={0}>{variant.label}</Radio>
                  ))}
                </RadioGroup>
              )}
            />
          </UI.Div>
        )}
      </UI.Div>

      <UI.Button type="submit" variantColor="teal" size="sm" ml={2} mb={4}>Apply filters</UI.Button>
    </UI.Form>
  );
};

const TableHeadingRow = styled(UI.Grid)`
  ${({ theme }) => css`
    background: ${theme.colors.gray[100]};
    padding: 12px 16px;
    border-radius: 10px;
    margin-bottom: 12px;
  `}
`;

const TableRow = styled(UI.Grid)`
  background: white;
  align-items: center;
  padding: 6px 12px;
  margin-bottom: 12px;
  border-radius: 12px;
  box-shadow: 0 4px 6px -1px rgba(0,0,0,0.01),0 2px 4px -1px rgba(0,0,0,0.03);
  transition: all 0.2s ease-in;
  cursor: pointer;

  &:hover {
    cursor: pointer;
    box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05),0 2px 4px -1px rgba(0,0,0,0.08);
    transition: all 0.2s ease-in;
  }
`;

const TableHeadingCellContainer = styled(UI.Div)`
  ${({ theme }) => css`
    font-weight: 600;
    line-height: 1rem;
    font-size: 0.8rem;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: ${theme.colors.gray[500]};
    display: flex;
    align-items: center;

    svg {
      stroke: ${theme.colors.gray[400]};
    }

    .active {
      stroke: ${theme.colors.gray[800]};
    }
  `}
`;

interface TableHeadingCellProps {
  children: React.ReactNode;
  sorting?: boolean;
  descending?: boolean;
  onDescendChange?: (isDescend: boolean) => void;
}

const TableHeadingCell = ({ children, sorting, descending = true, onDescendChange }: TableHeadingCellProps) => (
  <TableHeadingCellContainer>
    {children}

    {sorting && (
      <UI.Icon ml={2} width="21px" display="block">
        <IconSortUp onClick={() => onDescendChange?.(false)} className={descending ? '' : 'active'} />
        <IconSortDown
          onClick={() => onDescendChange?.(true)}
          className={descending ? 'active' : ''}
          style={{ marginTop: '-8px' }}
        />
      </UI.Icon>
    )}
  </TableHeadingCellContainer>
);

const TableCell = styled(UI.Div)``;
