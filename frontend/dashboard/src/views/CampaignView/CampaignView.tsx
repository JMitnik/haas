import * as UI from '@haas/ui';
import { format } from 'date-fns';
import { useNavigator } from 'hooks/useNavigator';
import React, { useState } from 'react';
import { useRef } from 'react';
import { useEffect } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { AtSign, Clock, Eye, Flag, Phone, Plus, Smartphone } from 'react-feather';
import { useTranslation } from 'react-i18next';
import { DeepPartial } from 'types/customTypes';
import { CampaignVariantEnum, DeliveryConnectionFilter, DeliveryStatusEnum, DeliveryType, GetWorkspaceCampaignQuery, PaginationSortByEnum, useGetWorkspaceCampaignQuery } from 'types/generated-types';
import { ImportDeliveriesForm } from './ImportDeliveriesForm';

export const defaultCampaignViewFilter: DeliveryConnectionFilter = {
  paginationFilter: {
    limit: 7,
    startDate: undefined,
    endDate: undefined,
    pageIndex: 0,
    offset: 0,
    orderBy: [
      {
        by: PaginationSortByEnum.ScheduledAt,
        desc: true,
      },
      {
        by: PaginationSortByEnum.UpdatedAt,
        desc: true
      },
    ],
  },
};

const POLL_INTERVAL_SECONDS = 60;
const POLL_INTERVAL = POLL_INTERVAL_SECONDS * 1000;

const DeliveryScheduledLabel = ({ scheduledAt }: { scheduledAt: string }) => {
  const date = new Date(parseInt(scheduledAt, 10));

  return (
    <UI.Flex alignItems="center">
      <UI.Icon pr={1}>
        <Clock width="0.7rem" />
      </UI.Icon>
      {format(date, 'MM/dd HH:mm')}
    </UI.Flex>
  )
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
      )
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
                      <DeliveryScheduledLabel scheduledAt={delivery.scheduledAt} />
                    )}
                  </UI.Span>
                </>
              </UI.Stack>
            </UI.Div>
          </ErrorBoundary>
        </UI.Label>
      )
    }

    case DeliveryStatusEnum.Opened: {
      return (
        <UI.Label variantColor="yellow">{status}</UI.Label>
      )
    }

    default: {
      return (
        <UI.Label>{status}</UI.Label>
      )
    }
  }
}

export const CampaignView = () => {
  const [isOpenImportModal, setIsOpenImportModal] = useState(false);
  const [isOpenDetailModel, setIsOpenDetailModel] = useState(false);
  const [activeDelivery, setActiveDelivery] = useState<DeepPartial<DeliveryType> | null>(null);
  const { t } = useTranslation();

  const [paginationState, setPaginationState] = useState(defaultCampaignViewFilter);

  const { customerSlug, campaignId, getCampaignsPath } = useNavigator();
  const campaignsPath = getCampaignsPath();

  const { data } = useGetWorkspaceCampaignQuery({
    fetchPolicy: 'cache-and-network',
    variables: {
      campaignId,
      customerSlug,
      deliveryConnectionFilter: paginationState,
    },
    pollInterval: POLL_INTERVAL
  });

  useEffect(() => {
    if (activeDelivery) {
      setIsOpenDetailModel(true);
    } else {
      setIsOpenDetailModel(false);
    }
  }, [activeDelivery, setIsOpenImportModal]);

  const campaign = data?.customer?.campaign;
  const deliveryConnection = campaign?.deliveryConnection;

  return (
    <>
      <UI.ViewHeading>
        <UI.Stack>
          <UI.Breadcrumb to={campaignsPath}>{t('back_to_campaigns')}</UI.Breadcrumb>
          <UI.Stack isInline alignItems="center" spacing={4}>
            <UI.PageTitle>{campaign?.label}</UI.PageTitle>
            <UI.Button
              leftIcon={Plus}
              onClick={() => setIsOpenImportModal(true)} size="sm" variantColor="teal">{t('import_deliveries')}</UI.Button>
          </UI.Stack>
        </UI.Stack>
      </UI.ViewHeading>
      <UI.ViewContainer>
        <UI.Card noHover>
          <UI.Div p={2}>
            <UI.Table width="100%">
              <UI.TableHeading>
                <UI.TableHeadingCell>
                  {t('recipient')}
                </UI.TableHeadingCell>
                <UI.TableHeadingCell>
                  {t('recipient_adress')}
                </UI.TableHeadingCell>
                <UI.TableHeadingCell>
                  {t('variant')}
                </UI.TableHeadingCell>
                <UI.TableHeadingCell>
                  {t('status')}
                </UI.TableHeadingCell>
              </UI.TableHeading>

              <UI.TableBody>
                {deliveryConnection?.deliveries.map(delivery => (
                  <UI.TableRow hasHover key={delivery.id} onClick={() => setActiveDelivery(delivery)}>
                    <UI.TableCell>
                      {delivery?.deliveryRecipientFirstName || ''}
                    </UI.TableCell>
                    <UI.TableCell>
                      {delivery?.deliveryRecipientEmail}
                    </UI.TableCell>
                    <UI.TableCell>
                      {delivery?.campaignVariant?.label}
                    </UI.TableCell>
                    <UI.TableCell>
                      <DeliveryStatus
                        delivery={delivery}
                      />
                    </UI.TableCell>
                  </UI.TableRow>
                ))}
              </UI.TableBody>
            </UI.Table>
          </UI.Div>
          {(deliveryConnection?.pageInfo?.nrPages || 0) > 1 && (
            <UI.PaginationFooter>
              <UI.Div style={{ lineHeight: 'normal' }}>
                Showing page
                <UI.Span ml={1} fontWeight="bold">
                  {(paginationState.paginationFilter?.pageIndex || 0) + 1}
                </UI.Span>
                <UI.Span ml={1}>
                  out of
                </UI.Span>
                <UI.Span ml={1} fontWeight="bold">
                  {deliveryConnection?.pageInfo.nrPages}
                </UI.Span>
                <UI.Span ml={3}>
                  (Total deliveries: {data?.customer?.campaign.allDeliveryConnection?.nrTotal})
                </UI.Span>
              </UI.Div>

              <UI.Div>
                <UI.Stack isInline>
                  <UI.Button
                    onClick={() => setPaginationState(state => ({
                      ...state,
                      paginationFilter: {
                        ...state.paginationFilter,
                        pageIndex: (state.paginationFilter?.pageIndex || 0) - 1,
                        offset: (state.paginationFilter?.offset || 0) - (state.paginationFilter?.limit || 0),
                      }
                    }))}
                    isDisabled={paginationState.paginationFilter?.pageIndex === 0}>Previous</UI.Button>
                  <UI.Button
                    onClick={() => setPaginationState(state => ({
                      ...state,
                      paginationFilter: {
                        ...state.paginationFilter,
                        pageIndex: (state.paginationFilter?.pageIndex || 0) + 1,
                        offset: (state.paginationFilter?.offset || 0) + (state.paginationFilter?.limit || 0),
                      }
                    }))}
                    isDisabled={(paginationState.paginationFilter?.pageIndex || 0) + 1 === deliveryConnection?.pageInfo.nrPages}>Next</UI.Button>
                </UI.Stack>
              </UI.Div>
            </UI.PaginationFooter>
          )}
        </UI.Card>

        <UI.Modal isOpen={isOpenDetailModel} onClose={() => setActiveDelivery(null)}>
          <UI.Card bg="white" width={600} noHover>
            <UI.CardBody>
              <UI.FormSectionHeader>{t('details')}</UI.FormSectionHeader>
              <UI.Stack mb={4}>
                <UI.Div>
                  <UI.Helper mb={1}>{t('first_name')}</UI.Helper>
                  {activeDelivery?.deliveryRecipientFirstName}
                </UI.Div>
                <UI.Div>
                  <UI.Helper mb={1}>{t('last_name')}</UI.Helper>
                  {activeDelivery?.deliveryRecipientLastName}
                </UI.Div>

                <UI.Div>
                  <UI.Helper mb={1}>{t('email')}</UI.Helper>
                  {activeDelivery?.deliveryRecipientEmail}
                </UI.Div>
                <UI.Div>
                  <UI.Helper mb={1}>{t('phone')}</UI.Helper>
                  {activeDelivery?.deliveryRecipientPhone}
                </UI.Div>
              </UI.Stack>

              <UI.Hr />

              <UI.FormSectionHeader>{t('events')}</UI.FormSectionHeader>
              <UI.Stack spacing={4}>
                {activeDelivery?.events?.map(event => (
                  <UI.Flex alignItems="center" justifyContent="space-between">
                    {event?.status === DeliveryStatusEnum.Scheduled && (
                      <UI.Flex alignItems="center">
                        <UI.Div mr={2} bg="gray.200" padding="5px" color="gray.500" style={{ borderRadius: '100%' }}>
                          <Clock />
                        </UI.Div>
                        {t('scheduled_event')}
                      </UI.Flex>
                    )}
                    {event?.status === DeliveryStatusEnum.Deployed && (
                      <UI.Flex alignItems="center">
                        <UI.Div mr={2} bg="blue.200" padding="5px" color="blue.500" style={{ borderRadius: '100%' }}>
                          {activeDelivery.campaignVariant?.type === CampaignVariantEnum.Email ? (
                            <AtSign />
                          ) : (
                              <Smartphone />
                            )}
                        </UI.Div>
                        {t('deployed_event')}
                      </UI.Flex>
                    )}
                    {event?.status === DeliveryStatusEnum.Opened && (
                      <UI.Flex alignItems="center">
                        <UI.Div mr={2} bg="yellow.200" padding="5px" color="yellow.500" style={{ borderRadius: '100%' }}>
                          <Eye />
                        </UI.Div>
                        {t('opened_event')}
                      </UI.Flex>
                    )}
                    {event?.status === DeliveryStatusEnum.Finished && (
                      <UI.Flex alignItems="center">
                        <UI.Div mr={2} bg="green.200" padding="5px" color="green.500" style={{ borderRadius: '100%' }}>
                          <Flag />
                        </UI.Div>
                        {t('finished_event')}
                      </UI.Flex>
                    )}
                    <UI.Span color="gray.500">
                      {event?.createdAt && (
                        <>
                          {format(parseInt(event?.createdAt, 10), 'MMM Mo HH:mm')}
                        </>
                      )}
                    </UI.Span>
                  </UI.Flex>
                ))}
              </UI.Stack>
            </UI.CardBody>
          </UI.Card>
        </UI.Modal>

        <UI.Modal isOpen={isOpenImportModal} onClose={() => setIsOpenImportModal(false)}>
          <UI.Card bg="white" noHover width={700}>
            <UI.CardBody>
              <ImportDeliveriesForm
                onClose={() => setIsOpenImportModal(false)} />
            </UI.CardBody>
          </UI.Card>
        </UI.Modal>
      </UI.ViewContainer>
    </>
  )
};