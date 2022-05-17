import * as UI from '@haas/ui';
import {
  NumberParam,
  StringParam,
  useQueryParams,
  withDefault,
} from 'use-query-params';
import { Plus } from 'react-feather';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import React, { useState } from 'react';

import * as Table from 'components/Common/Table';
import {
  AutomationConnection,
  AutomationConnectionOrderType,
  useAutomationConnectionQuery,
} from 'types/generated-types';
import { ReactComponent as NoDataIll } from 'assets/images/undraw_no_data.svg';
import Searchbar from 'components/Common/SearchBar';
import useAuth from 'hooks/useAuth';

import { View } from 'layouts/View';
import AutomationCard from './AutomationCard';

interface AutomationOverviewProps {
  automationConnection: AutomationConnection
}

const AutomationOverview = ({ automationConnection }: AutomationOverviewProps) => {
  const { customerSlug } = useParams<{ customerSlug: string }>();
  const { t } = useTranslation();
  const [activeAutomationConnection, setAutomationConnection] = useState<AutomationConnection>(automationConnection);
  const [filter, setFilter] = useQueryParams({
    search: StringParam,
    pageIndex: withDefault(NumberParam, 0),
    perPage: withDefault(NumberParam, 7),
  });

  const { loading: isLoading } = useAutomationConnectionQuery({
    fetchPolicy: 'network-only',
    variables: {
      customerSlug,
      filter: {
        search: filter.search,
        offset: filter.pageIndex * filter.perPage,
        perPage: filter.perPage,
        orderBy: {
          by: AutomationConnectionOrderType.UpdatedAt,
          desc: true,
        },
      },
    },
    errorPolicy: 'ignore',
    notifyOnNetworkStatusChange: true,
    onCompleted: (fetchedData) => {
      setAutomationConnection(fetchedData.customer?.automationConnection as AutomationConnection);
    },
  });

  const { canCreateAutomations } = useAuth();

  const filteredAutomations = activeAutomationConnection.automations;
  const pageCount = activeAutomationConnection.totalPages || 0;

  return (
    <View documentTitle="haas | Automations">
      <UI.ViewHead>
        <UI.Flex justifyContent="space-between">
          <UI.Div>
            <UI.Flex alignItems="flex-end" flexWrap="wrap">
              <UI.Div mr={4}>
                <UI.ViewTitle>
                  {t('automations')}
                </UI.ViewTitle>
                <UI.ViewSubTitle>
                  {t('automations_subtitle')}
                </UI.ViewSubTitle>
              </UI.Div>

              {canCreateAutomations && (
                <UI.Div>
                  <UI.NavButton
                    leftIcon={Plus}
                    size="sm"
                    to={`/dashboard/b/${customerSlug}/automation/add`}
                  >
                    {t('create_automation')}
                  </UI.NavButton>
                </UI.Div>
              )}
            </UI.Flex>
          </UI.Div>

          <UI.Div>
            <Searchbar
              search={filter.search}
              onSearchChange={(search) => {
                setFilter((prevValues) => ({
                  ...prevValues,
                  search,
                  pageIndex: 0,
                }));
              }}
            />
          </UI.Div>
        </UI.Flex>
      </UI.ViewHead>
      <UI.ViewBody>
        <UI.Grid
          gridGap={4}
          gridTemplateColumns={['1fr', 'repeat(auto-fill, minmax(350px, 1fr))']}
          gridAutoRows="minmax(200px, 1fr)"
        >
          {filteredAutomations?.map((automation, index) => automation && (
            <AutomationCard key={index} automation={automation} />
          ))}
        </UI.Grid>

        {!isLoading && filteredAutomations.length === 0 && (
          <UI.IllustrationCard
            boxShadow="sm"
            svg={<NoDataIll />}
            text={t('no_automations_found')}
          >
            <UI.Button variant="outline" onClick={() => setFilter({ pageIndex: 0, search: '' })}>
              {t('clear_filters')}
            </UI.Button>
          </UI.IllustrationCard>
        )}

        <UI.Div mt={4} width="100%">
          <UI.Flex alignItems="center" justifyContent="space-between">
            <UI.Div mr={4} />
            <UI.Flex alignItems="center">
              <UI.Div ml={4}>
                {pageCount > 1 && (
                  <Table.Pagination
                    pageIndex={filter.pageIndex}
                    maxPages={pageCount}
                    perPage={filter.perPage}
                    isLoading={isLoading}
                    setPageIndex={(page) => setFilter((newFilter) => ({ ...newFilter, pageIndex: page - 1 }))}
                  />
                )}
              </UI.Div>
            </UI.Flex>
          </UI.Flex>
        </UI.Div>
      </UI.ViewBody>
    </View>
  );
};

export default AutomationOverview;
