import * as UI from '@haas/ui';
import { NumberParam, StringParam, useQueryParams, withDefault } from 'use-query-params';
import { Plus, Share } from 'react-feather';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import React, { useState } from 'react';

import * as Popover from 'components/Common/Popover';
import * as Table from 'components/Common/Table';
import { DialogueConnection, DialogueConnectionOrder, useDialogueConnectionQuery } from 'types/generated-types';
import { ReactComponent as NoDataIll } from 'assets/images/undraw_no_data.svg';
import { View } from 'layouts/View';
import Searchbar from 'components/Common/SearchBar';
import useAuth from 'hooks/useAuth';

import { useClipboard } from '@chakra-ui/core';
import { useCustomer } from 'providers/CustomerProvider';
import DialogueCard from './DialogueCard';

const DialogueOverview = () => {
  const { activeCustomer } = useCustomer();
  const { customerSlug } = useParams<{ customerSlug: string }>();
  const { t } = useTranslation();
  const [filter, setFilter] = useQueryParams({
    search: StringParam,
    pageIndex: withDefault(NumberParam, 0),
    perPage: withDefault(NumberParam, 9),
  });

  const [activeDialogueConnection, setDialogueConnection] = useState<DialogueConnection>();

  const { loading: isLoading } = useDialogueConnectionQuery({
    fetchPolicy: 'cache-and-network',
    variables: {
      customerSlug,
      filter: {
        searchTerm: filter.search,
        offset: filter.pageIndex * filter.perPage,
        perPage: filter.perPage,
        orderBy: {
          by: DialogueConnectionOrder.CreatedAt,
          desc: true,
        },
      },
    },
    errorPolicy: 'ignore',
    notifyOnNetworkStatusChange: true,
    onCompleted: (fetchedData) => {
      setDialogueConnection(fetchedData.customer?.dialogueConnection as DialogueConnection);
    },
  });

  const { canDeleteDialogue } = useAuth();

  const filteredDialogues = activeDialogueConnection?.dialogues || [];
  const pageCount = activeDialogueConnection?.totalPages || 0;

  const [openShare, setOpenShare] = useState(false);
  const shareUrl = `${window.location.origin}/public/dialogue-link-fetch?workspaceId=${activeCustomer?.id}`;
  const { onCopy, hasCopied } = useClipboard(shareUrl);

  return (
    <View documentTitle="haas | Dialogues">
      <UI.ViewHead>
        <UI.Flex justifyContent="space-between">
          <UI.Div>
            <UI.Flex alignItems="flex-end" flexWrap="wrap">
              <UI.Div mr={4}>
                <UI.ViewTitle>
                  {t('teams')}
                </UI.ViewTitle>
                <UI.ViewSubTitle>
                  {t('teams_subtitle')}
                </UI.ViewSubTitle>
              </UI.Div>

              {canDeleteDialogue && (
                <UI.Flex>
                  <UI.NavButton
                    leftIcon={Plus}
                    size="sm"
                    to={`/dashboard/b/${customerSlug}/dialogue/add`}
                  >
                    {t('add_team')}
                  </UI.NavButton>

                  <Popover.Root open={openShare} onOpenChange={setOpenShare}>
                    <Popover.Trigger asChild>
                      <UI.Button ml={2} size="sm" variantColor="off" leftIcon={Share}>
                        Share team links
                      </UI.Button>
                    </Popover.Trigger>
                    <Popover.Content isOpen={openShare}>
                      <UI.Card minWidth={500}>
                        <UI.CardBody>
                          <UI.Div mb={2}>
                            <UI.H4 color="off.500">
                              Share dialogues
                            </UI.H4>
                            <UI.Text color="off.500">
                              Share your dialogues with your team and get feedback from their people.
                            </UI.Text>
                          </UI.Div>

                          <UI.Div>
                            <UI.Div>
                              <UI.Helper mb={1}>Link hub</UI.Helper>
                              <UI.Input
                                mt={2}
                                rightEl={(
                                  <UI.Button width="auto" size="sm" onClick={onCopy}>
                                    {hasCopied ? 'Copied' : 'Copy'}
                                  </UI.Button>
                                )}
                                borderRadius={10}
                                value={shareUrl}
                                isReadOnly
                              />
                            </UI.Div>
                          </UI.Div>
                        </UI.CardBody>
                      </UI.Card>
                    </Popover.Content>
                  </Popover.Root>

                </UI.Flex>
              )}
            </UI.Flex>
          </UI.Div>

          <UI.Div>
            <Searchbar
              search={filter.search}
              isLoading={isLoading}
              onSearchChange={(newTerm) => {
                setFilter(
                  (newFilter) => ({ ...newFilter, pageIndex: 0, search: newTerm }),
                );
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
          {filteredDialogues.map((dialogue: any, index: any) => dialogue && (
            <DialogueCard key={index} dialogue={dialogue} />
          ))}
        </UI.Grid>

        {!isLoading && filteredDialogues.length === 0 && (
          <UI.IllustrationCard
            boxShadow="sm"
            svg={<NoDataIll />}
            text={t('no_dialogues_found')}
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

export default DialogueOverview;
