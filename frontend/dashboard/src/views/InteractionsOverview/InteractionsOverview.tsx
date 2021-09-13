/* eslint-disable @typescript-eslint/no-use-before-define */
/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable radix */
import * as UI from '@haas/ui';
import * as qs from 'qs';
import { Activity, Filter } from 'react-feather';
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
import { useLocation } from 'react-router';
import { useNavigator } from 'hooks/useNavigator';
import { useTranslation } from 'react-i18next';
import React, { useCallback, useState } from 'react';
import styled, { css } from 'styled-components';

import {
  CompactEntriesPath,
} from 'views/DialogueView/Modules/InteractionFeedModule/InteractionFeedEntry';
import { Controller, useForm } from 'react-hook-form';
import { SessionDeliveryType, SessionFragmentFragment, useGetInteractionsQueryQuery } from 'types/generated-types';
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

interface CampaignVariant {
  id: string;
  label: string;
}

const undefinedToNull = (value: any) => {
  if (value === undefined) {
    return 'all';
  }

  return value;
};

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

  useGetInteractionsQueryQuery({
    variables: {
      customerSlug,
      dialogueSlug,
      sessionsFilter: {
        startDate: startDate?.toISOString(),
        endDate: endDate?.toISOString(),
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

  const handleSearchTermChange = useCallback(debounce((search: string) => {
    setFilter((prevValues) => ({
      ...prevValues,
      search,
      pageIndex: 0,
    }));
  }, 250), []);

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
        <UI.Flex mb={4} justifyContent="flex-end">
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
        <UI.Div width="100%">
          <TableHeadingRow gridTemplateColumns="30px 1fr 1fr 1fr 1fr">
            <UI.Div />
            <TableHeadingCell>
              User
            </TableHeadingCell>
            <TableHeadingCell>
              Interaction
            </TableHeadingCell>
            <TableHeadingCell>
              Path
            </TableHeadingCell>
            <TableHeadingCell>
              Delivery
            </TableHeadingCell>
          </TableHeadingRow>
          <UI.Div>
            {sessions.map((session) => (
              <TableRow gridTemplateColumns="30px 1fr 1fr 1fr 1fr" key={session.id}>
                <UI.Div />
                <TableCell>
                  {session.score}
                </TableCell>
                <TableCell>
                  {session.createdAt}
                </TableCell>
                <TableCell>
                  <CompactEntriesPath nodeEntries={session.nodeEntries} />
                </TableCell>
                <TableCell>
                  <UI.Label>
                    {session.delivery?.id}
                  </UI.Label>
                </TableCell>
              </TableRow>
            ))}
          </UI.Div>
        </UI.Div>
      </UI.ViewBody>
    </>
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
  margin-bottom: 6px;
`;

const TableRow = styled(UI.Grid)`
  background: white;
  align-items: center;
  margin-bottom: 12px;
  padding: 12px;
  border-radius: 10px;
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
  font-weight: 600;
  line-height: 1rem;
  font-size: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;
