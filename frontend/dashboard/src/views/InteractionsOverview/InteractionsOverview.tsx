/* eslint-disable @typescript-eslint/no-use-before-define */
/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable radix */
import '@szhsin/react-menu/dist/index.css';
import * as UI from '@haas/ui';
import * as qs from 'qs';
import { Activity, Calendar, Filter, MessageCircle } from 'react-feather';
import { AnimatePresence, motion } from 'framer-motion';
import { ControlledMenu, MenuHeader, MenuItem, MenuState, SubMenu, useMenuState } from '@szhsin/react-menu';
import { Controller, useForm } from 'react-hook-form';
import { Flex, ViewTitle } from '@haas/ui';
import {
  Icon,
  Popover,
  PopoverCloseButton,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger,
  Radio,
  RadioGroup,
  useDisclosure,
} from '@chakra-ui/core';
import { ROUTES, useNavigator } from 'hooks/useNavigator';
import { Route, Switch, useLocation } from 'react-router';
import { endOfDay, format, startOfDay } from 'date-fns';
import { useTranslation } from 'react-i18next';
import React, { Dispatch, SetStateAction, useEffect, useRef, useState } from 'react';
import styled, { css } from 'styled-components';

import {
  CompactEntriesPath,
} from 'views/DialogueView/Modules/InteractionFeedModule/InteractionFeedEntry';
import {
  DeliveryFragmentFragment,
  SessionDeliveryType, SessionFragmentFragment, useGetInteractionsQueryQuery,
} from 'types/generated-types';
import { ReactComponent as IconClose } from 'assets/icons/icon-close.svg';
import { formatSimpleDate } from 'utils/dateUtils';
import { paginate } from 'utils/paginate';
import { useDateFilter } from 'hooks/useDateFilter';
import SearchBar from 'components/SearchBar/SearchBar';
import useDebouncedEffect from 'hooks/useDebouncedEffect';

import { ErrorBoundary } from 'react-error-boundary';
import { InteractionModalCard } from './InteractionModalCard';

interface TableProps {
  search: string;
  pageIndex: number;
  perPage: number;
  sortBy: {
    by: string;
    desc: boolean;
  }[];
  totalPages: number;
  startDate?: Date;
  endDate?: Date;
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

const AnonymousCell = ({ sessionId }: { sessionId: string }) => (
  <UI.Flex alignItems="center">
    <UI.Div mr={2}>
      <Avatar name="A" brand="gray" />
    </UI.Div>
    <UI.ColumnFlex>
      <UI.Span fontWeight={600} color="gray.500">
        Anonymous
      </UI.Span>
      <UI.Span color="gray.400" fontSize="0.7rem">
        {sessionId}
      </UI.Span>
    </UI.ColumnFlex>
  </UI.Flex>
);

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

const MenuContainer = styled.div`
  ${({ theme }) => css`
    .szh-menu {
      min-width: 200px;
      border-radius: 10px;
      padding: 0;
    }

    .szh-menu .szh-menu__header:first-child {
      border-radius: 10px 10px 0 0;
    }

    .szh-menu__item--hover {
      background: ${theme.colors.gray[100]};
    }

    .szh-menu__header {
      padding: 6px 12px;
      display: flex;
      font-weight: 600;
      line-height: 1rem;
      font-size: 0.7rem;
      text-transform: uppercase;
      align-items: center;
      background: ${theme.colors.gray[50]};
      letter-spacing: 0.05em;
      color: ${theme.colors.gray[500]};

      ${UI.Icon} {
        margin-right: 6px;
      }
    }

    .szh-menu__submenu > .szh-menu__item {
      padding: 4px 16px;
      color: ${theme.colors.gray[600]};
      font-weight: 600;

      ${UI.Icon} {
        max-width: 20px;
        margin-right: 12px;

        svg {
          max-width: 100%;
        }
      }
    }
  `}
`;

interface MenuProps {
  children: React.ReactNode;
  anchorPoint: { x: number; y: number };
  endTransition: () => void;
  onClose: () => void;
  state?: MenuState;
}

const MotionControlledMenu = motion.custom(ControlledMenu);

const Menu = ({ children, ...menuProps }: MenuProps) => (
  <MenuContainer>
    <motion.div>
      <AnimatePresence exitBeforeEnter>
        <MotionControlledMenu {...menuProps}>
          <motion.div key={menuProps.state} exit={{ opacity: 0 }} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            {children}
          </motion.div>
        </MotionControlledMenu>
      </AnimatePresence>
    </motion.div>
  </MenuContainer>
);

export const InteractionsOverview = () => {
  const { t } = useTranslation();
  const { customerSlug, dialogueSlug, goToInteractionsView } = useNavigator();
  const location = useLocation();

  const [campaignVariants, setCampaignVariants] = useState<CampaignVariant[]>([]);
  const [sessions, setSessions] = useState<SessionFragmentFragment[]>(() => []);
  const { startDate, endDate, setDate } = useDateFilter({});
  const [filter, setFilter] = useState<TableProps>({
    startDate,
    endDate,
    search: qs.parse(location.search, { ignoreQueryPrefix: true })?.search?.toString() || '',
    pageIndex: 0,
    perPage: 10,
    sortBy: [{ by: 'createdAt', desc: true }],
    totalPages: 0,
    filterCampaigns: 'all',
    filterCampaignId: 'all',
  });

  useEffect(() => {
    setFilter((newFilter) => ({
      ...newFilter,
      startDate,
      endDate,
    }));
  }, [startDate, endDate, setFilter]);

  useGetInteractionsQueryQuery({
    variables: {
      customerSlug,
      dialogueSlug,
      sessionsFilter: {
        offset: filter.pageIndex * filter.perPage,
        startDate: filter.startDate ? filter.startDate?.toISOString() : undefined,
        perPage: filter.perPage,
        endDate: filter.endDate ? filter.endDate?.toISOString() : undefined,
        search: filter.search,
        deliveryType: filter.filterCampaigns === 'all' ? undefined : filter.filterCampaigns,
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

      setFilter((filterValues) => ({
        ...filterValues,
        totalPages: fetchedData.customer?.dialogue?.sessionConnection?.totalPages || 0,
      }));
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
                onChange={setDate}
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
          <ActiveFilters filter={filter} setFilters={setFilter} />
        </UI.Flex>
        <UI.Div width="100%">
          <TableHeadingRow gridTemplateColumns="1fr 1fr 1fr 1fr">
            <TableHeadingCell>
              User
            </TableHeadingCell>
            <TableHeadingCell>
              Interaction
            </TableHeadingCell>
            <TableHeadingCell>
              Distribution
            </TableHeadingCell>
            <TableHeadingCell>
              Date
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
                Filter
              </MenuHeader>
              <SubMenu label={(
                <UI.Flex>
                  <UI.Icon mr={1} width={10}>
                    <Calendar />
                  </UI.Icon>
                  Date
                </UI.Flex>
              )}
              >
                <MenuItem
                  onClick={() => handleMultiDateFilterChange(undefined, new Date(contextInteraction?.createdAt))}
                >
                  Before date
                </MenuItem>
                <MenuItem
                  onClick={() => handleSingleDateFilterChange(contextInteraction?.createdAt)}
                >
                  On day
                </MenuItem>
                <MenuItem
                  onClick={() => handleMultiDateFilterChange(new Date(contextInteraction?.createdAt), undefined)}
                >
                  After day
                </MenuItem>
              </SubMenu>
              {contextInteraction?.delivery && (
                <>
                  <SubMenu label={(
                    <UI.Flex>
                      <UI.Icon mr={1} width={10}>
                        <MessageCircle />
                      </UI.Icon>
                      Campaign
                    </UI.Flex>
                  )}
                  >
                    <MenuItem
                      onClick={() => handleSearchTermChange(
                        contextInteraction?.delivery?.deliveryRecipientFirstName || '',
                      )}
                    >
                      More from
                      {' '}
                      {contextInteraction?.delivery?.deliveryRecipientFirstName}
                      {' '}
                      {contextInteraction?.delivery?.deliveryRecipientLastName}
                    </MenuItem>
                    <MenuItem onClick={() => handleCampaignVariantFilterChange({
                      filterCampaignVariant: contextInteraction?.delivery?.campaignVariant?.id,
                    })}
                    >
                      More from campaign variant
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
                <TableCell />
                <TableCell>
                  <DateCell timestamp={session.createdAt} />
                </TableCell>
              </TableRow>
            ))}
          </UI.Div>
          <UI.Flex justifyContent="flex-end" mt={4}>
            <Pagination
              pageIndex={filter.pageIndex}
              maxPages={filter.totalPages}
              perPage={filter.perPage}
              setPageIndex={(page) => setFilter((newFilter) => ({ ...newFilter, pageIndex: page - 1 }))}
            />
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
}: PaginationProps) => {
  const { pages } = paginate(maxPages, pageIndex + 1, perPage, 5);
  const startedRef = useRef<boolean>(false);
  const [inputPageIndex, setInputPageIndex] = useState(1);

  useDebouncedEffect(() => {
    if (startedRef.current) {
      startedRef.current = false;
      setPageIndex(Math.max(0, Number(inputPageIndex)));
    }
  }, 500, [inputPageIndex]);

  useEffect(() => {
    if (!startedRef.current) {
      startedRef.current = false;
      setInputPageIndex(pageIndex);
    }
  }, [pageIndex, setInputPageIndex]);

  return (
    <PaginationContainer bg="white" padding={2}>
      <UI.Flex alignItems="center">
        <UI.Div mr={2}>
          Page
          {' '}
          {pageIndex + 1}
          {' '}
          out of
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
        <UI.Stack spacing={2} isInline>
          {pages.map((page) => (
            <UI.Button
              size="sm"
              variantColor="teal"
              isActive={page - 1 === pageIndex}
              key={page}
              onClick={() => setPageIndex(page)}
            >
              {page}
            </UI.Button>
          ))}
        </UI.Stack>
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

const TableHeadingCell = styled(UI.Div)`
  ${({ theme }) => css`
    font-weight: 600;
    line-height: 1rem;
    font-size: 0.8rem;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: ${theme.colors.gray[500]};
  `}
`;

const TableCell = styled(UI.Div)`
  /* font-weight: 600;
  line-height: 1rem;
  font-size: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 0.05em; */
`;
