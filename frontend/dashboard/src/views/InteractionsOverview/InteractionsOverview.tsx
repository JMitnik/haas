/* eslint-disable @typescript-eslint/no-use-before-define */
/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable radix */
import * as UI from '@haas/ui';
import * as qs from 'qs';
import { Activity, Crosshair, Filter } from 'react-feather';
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
import { debounce } from 'lodash';
import { format } from 'date-fns';
import { useLocation } from 'react-router';
import { useNavigator } from 'hooks/useNavigator';
import { useTranslation } from 'react-i18next';
import React, { Dispatch, SetStateAction, useCallback, useEffect, useState } from 'react';
import styled, { css } from 'styled-components';

import {
  CompactEntriesPath,
} from 'views/DialogueView/Modules/InteractionFeedModule/InteractionFeedEntry';
import {DeliveryFragmentFragment,
  SessionDeliveryType, SessionFragmentFragment, useGetInteractionsQueryQuery } from 'types/generated-types';
import { ReactComponent as IconClose } from 'assets/icons/icon-close.svg';
import { paginate } from 'utils/paginate';
import { useDateFilter } from 'hooks/useDateFilter';
import SearchBar from 'components/SearchBar/SearchBar';

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
  console.log(firstLetter);

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

const FilterButton = ({ filterKey, value, onDisable }: FilterButtonProps) => {
  console.log(filterKey);
  return (
    <UI.Label fontSize="0.7rem">
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
    </UI.Label>
  );
};

const ActiveFilters = ({
  filter,
  setFilters
}: { filter: TableProps, setFilters: Dispatch<SetStateAction<TableProps>>}) => {
  console.log('filter');
  return (
    <UI.Stack isInline spacing={2} alignItems="center">
      {!!filter.search && (
        <FilterButton
          filterKey="search"
          value={filter.search}
          onDisable={() => setFilters((filter) => ({ ...filter, search: '' }))}
        />
      )}
      {/* {(filter.startDate || filter.endDate) && (
      <UI.Label>
        date:
        {filter.startDate?.toISOString()}
        {' - '}
        {filter.endDate?.toISOString()}
      </UI.Label>
      )}
      {!!filter.filterCampaigns && (
      <UI.Label>
        distribution:
        {' '}
        {filter.filterCampaigns}
      </UI.Label>
      )}
      {!!filter.filterCampaignId && (
      <UI.Label>
        campaign-variant:
        {' '}
        {filter.filterCampaignId}
      </UI.Label> */}
    </UI.Stack>
  );
};

interface CampaignVariant {
  id: string;
  label: string;
}

export const InteractionsOverview = () => {
  const { t } = useTranslation();
  const { dialogueSlug, customerSlug } = useNavigator();
  const location = useLocation();

  const [campaignVariants, setCampaignVariants] = useState<CampaignVariant[]>([]);
  const [sessions, setSessions] = useState<SessionFragmentFragment[]>(() => []);
  const { startDate, endDate, setDate } = useDateFilter({});
  const [filter, setFilter] = useState<TableProps>({
    startDate,
    endDate,
    search: qs.parse(location.search, { ignoreQueryPrefix: true })?.search?.toString() || '',
    pageIndex: 0,
    perPage: 8,
    sortBy: [{ by: 'createdAt', desc: true }],
    totalPages: 0,
    filterCampaigns: 'all',
    filterCampaignId: 'all',
  });

  useEffect(() => {
    console.log(startDate);
    console.log(endDate);

    setFilter((filter) => ({
      ...filter,
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
        startDate: filter.startDate?.toISOString(),
        endDate: filter.endDate?.toISOString(),
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

  // const [fetchCSVData, { loading: csvLoading }] = useLazyQuery<CustomerSessionConnection>(
  //   getDialogueSessionConnectionQuery, {
  //     fetchPolicy: 'cache-and-network',
  //     onCompleted: (csvData: any) => {
  //       const sessions = csvData?.customer?.dialogue?.sessionConnection?.sessions;
  //       handleExportCSV(sessions, customerSlug, dialogueSlug);
  //     },
  //   },
  // );

  const handleCampaignVariantFilterChange = (filterValues: CampaignVariantFormProps) => {
    setFilter({
      ...filter,
      filterCampaigns: filterValues.filterCampaigns as SessionDeliveryType,
      filterCampaignId: filterValues.filterCampaignVariant,
    });
  };

  const handleSearchTermChange = (search: string) => {
    setFilter((prevValues) => ({
      ...prevValues,
      search,
      pageIndex: 0,
    }));
  };

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
          <UI.Stack isInline spacing={4} alignItems="center">
            <UI.Div>
              <UI.DatePicker
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
            {sessions.map((session) => (
              <TableRow gridTemplateColumns="1fr 1fr 1fr 1fr" key={session.id}>
                <TableCell>
                  {session.delivery?.deliveryRecipientFirstName ? (
                    <DeliveryUserCell delivery={session.delivery} />
                  ): (
                    <AnonymousCell sessionId={session.id} />
                  )}
                </TableCell>
                <TableCell>
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
              setPageIndex={(page) => setFilter((filter) => ({...filter, pageIndex: page - 1}))}
            />
          </UI.Flex>
        </UI.Div>
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
  setPageIndex
}: PaginationProps) => {
  const { pages } = paginate(maxPages, pageIndex + 1, perPage, 5);

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

const PickerContainer = styled(UI.Div)<PickerContainerProps>`
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
  ${({ theme }) => css`
    background: white;
    align-items: center;
    padding: 6px 12px;
    margin-bottom: 12px;
    border-radius: 12px;
    box-shadow: 0 4px 6px -1px rgba(0,0,0,0.01),0 2px 4px -1px rgba(0,0,0,0.03);
  `}
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
