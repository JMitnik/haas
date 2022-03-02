import * as UI from '@haas/ui';
import { Button, ButtonGroup } from '@chakra-ui/core';
import { Div, Flex, Grid, H4, ViewTitle } from '@haas/ui';
import { Grid as GridIcon, List, Plus } from 'react-feather';
import { Link, useParams } from 'react-router-dom';
import {
  NumberParam,
  StringParam,
  useQueryParams,
  withDefault,
} from 'use-query-params';
import { useTranslation } from 'react-i18next';
import React, { useState } from 'react';

import * as Table from 'components/Common/Table';
import {
  AutomationConnection,
  AutomationConnectionOrderType,
  useAutomationConnectionQuery,
} from 'types/generated-types';
import Searchbar from 'components/SearchBar';
import SurveyIcon from 'components/Icons/SurveyIcon';
import useAuth from 'hooks/useAuth';

import { AddDialogueCard, TranslatedPlus } from './AutomationOverviewStyles';
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

  const [useDialogueGridView, setUseDialogueGridView] = useState(true);

  const { loading: isLoading } = useAutomationConnectionQuery({
    fetchPolicy: 'network-only',
    variables: {
      workspaceSlug: customerSlug,
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

  const { canDeleteDialogue } = useAuth();

  const filteredAutomations = activeAutomationConnection.automations;
  const pageCount = activeAutomationConnection.totalPages || 0;

  return (
    <>
      <UI.ViewHead>
        <UI.ViewTitle>
          <ViewTitle>{t('dialogues')}</ViewTitle>
        </UI.ViewTitle>
      </UI.ViewHead>
      <UI.ViewBody>

        <Div mb={4} maxWidth="800px" width="100%">
          <Flex alignItems="center">
            <Div mr={4}>
              <Searchbar
                activeSearchTerm=""
                onSearchTermChange={(search) => {
                  setFilter((prevValues) => ({
                    ...prevValues,
                    search,
                    pageIndex: 0,
                  }));
                }}
              />
            </Div>
            <ButtonGroup display="flex" alignItems="center">
              <Button
                size="sm"
                onClick={() => setUseDialogueGridView(true)}
                variantColor={useDialogueGridView ? 'blue' : 'gray'}
                leftIcon={GridIcon}
              >
                {t('grid')}
              </Button>
              <Button
                size="sm"
                onClick={() => setUseDialogueGridView(false)}
                variantColor={useDialogueGridView ? 'gray' : 'blue'}
                leftIcon={List}
              >
                {t('list')}
              </Button>
            </ButtonGroup>
            <UI.Flex justifyContent="flex-end" ml={4}>
              {pageCount > 1 && (
                <Table.Pagination
                  pageIndex={filter.pageIndex}
                  maxPages={pageCount}
                  perPage={filter.perPage}
                  isLoading={isLoading}
                  setPageIndex={(page) => setFilter((newFilter) => ({ ...newFilter, pageIndex: page - 1 }))}
                />
              )}
            </UI.Flex>
          </Flex>

        </Div>

        {useDialogueGridView ? (
          <Grid
            gridGap={4}
            gridTemplateColumns={['1fr', 'repeat(auto-fill, minmax(250px, 1fr))']}
            gridAutoRows="minmax(300px, 1fr)"
          >

            {filteredAutomations?.map((automation, index) => automation && (
              <AutomationCard key={index} automation={automation} />
            ))}

            {canDeleteDialogue && (
              <AddDialogueCard data-cy="AddDialogueCard">
                <Link to={`/dashboard/b/${customerSlug}/automation/add`} />

                <Flex flexDirection="column" alignItems="center" justifyContent="center">
                  <SurveyIcon />
                  <TranslatedPlus>
                    <Plus strokeWidth="3px" />
                  </TranslatedPlus>
                  <H4 color="default.dark">
                    {t('create_automation')}
                  </H4>
                </Flex>
              </AddDialogueCard>
            )}
          </Grid>
        ) : (
          <Grid gridRowGap={2}>
            {filteredAutomations?.map((automation, index: any) => automation && (
              <AutomationCard isCompact key={index} automation={automation} />
            ))}
          </Grid>
        )}
      </UI.ViewBody>
    </>
  );
};

export default AutomationOverview;
