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
import { CampaignVariantEnum, DeliveryConnectionFilter, JobStatusType, DeliveryType, PaginationSortByEnum, useGetAutodeckJobsQuery, GetAutodeckJobsQuery, PaginationWhereInput, CreateWorkspaceJobType } from 'types/generated-types';
import { ImportDeliveriesForm } from './ImportDeliveriesForm';

export const paginationFilter: PaginationWhereInput = {
    limit: 5,
    startDate: undefined,
    endDate: undefined,
    pageIndex: 0,
    offset: 0,
    orderBy: [
      {
        by: PaginationSortByEnum.UpdatedAt,
        desc: true
      },
    ],
};

const POLL_INTERVAL_SECONDS = 60;
const POLL_INTERVAL = POLL_INTERVAL_SECONDS * 1000;

const DateLabel = ({ dateString }: { dateString: string }) => {
  const date = new Date(parseInt(dateString, 10));

  return (
    <UI.Flex alignItems="center">
      <UI.Icon pr={1}>
        <Clock width="0.7rem" />
      </UI.Icon>
      {format(date, 'MM/dd HH:mm')}
    </UI.Flex>
  )
};

const DeliveryStatus = ({ job }: { job: DeepPartial<CreateWorkspaceJobType> }) => {
  const status = job.status;

  switch (status) {
    case JobStatusType.Completed: {
      return (
        <UI.Label variantColor="green">
          {status}
        </UI.Label>
      );
    }

    case JobStatusType.ReadyForProcessing: {
      return (
        <UI.Label variantColor="blue">
          {status}
        </UI.Label>
      )
    }

    default: {
      return (
        <UI.Label variantColor="yellow">{status}</UI.Label>
      )
    }
  }
}

export const AutodeckOverview = () => {
  const [isOpenImportModal, setIsOpenImportModal] = useState(false);
  const [isOpenDetailModel, setIsOpenDetailModel] = useState(false);
  const [activeJob, setActiveJob] = useState<DeepPartial<CreateWorkspaceJobType> | null>(null);
  const { t } = useTranslation();

  const [paginationState, setPaginationState] = useState(paginationFilter);

  // const { customerSlug, campaignId, getCampaignsPath } = useNavigator();
  // const campaignsPath = getCampaignsPath();

  const { data } = useGetAutodeckJobsQuery({
    fetchPolicy: 'cache-and-network',
    variables: {
     filter: paginationState,
    },
    pollInterval: POLL_INTERVAL
  });

  useEffect(() => {
    if (activeJob) {
      setIsOpenDetailModel(true);
    } else {
      setIsOpenDetailModel(false);
    }
  }, [activeJob, setIsOpenImportModal]);

  console.log('data: ', data?.getAutodeckJobs.jobs)
  // console.log('pageInfo: ', data?.getAutodeckJobs.pageInfo)
  // const campaign = data?.customer?.campaign;
  // const deliveryConnection = campaign?.deliveryConnection;

  return (
    <>
      <UI.ViewHeading>
        <UI.Stack>
          {/* <UI.Breadcrumb to={campaignsPath}>{t('back_to_campaigns')}</UI.Breadcrumb> */}
          <UI.Stack isInline alignItems="center" spacing={4}>
            <UI.PageTitle>{'Autodeck overview'}</UI.PageTitle>
            <UI.Button
              leftIcon={Plus}
              onClick={() => setIsOpenImportModal(true)} size="sm" variantColor="teal">{t('autodeck:create_job')}</UI.Button>
          </UI.Stack>
        </UI.Stack>
      </UI.ViewHeading>
      <UI.ViewContainer>
        <UI.Card noHover>
          <UI.Div p={2}>
            <UI.Table width="100%">
              <UI.TableHeading>
                <UI.TableHeadingCell>
                  {t('autodeck:job_name')}
                </UI.TableHeadingCell>
                <UI.TableHeadingCell>
                  {t('created_at')}
                </UI.TableHeadingCell>
                <UI.TableHeadingCell>
                  {t('updated_at')}
                </UI.TableHeadingCell>
                <UI.TableHeadingCell>
                  {t('status')}
                </UI.TableHeadingCell>
              </UI.TableHeading>

              <UI.TableBody>
                {data?.getAutodeckJobs?.jobs.map(job => (
                  <UI.TableRow hasHover key={job.id} onClick={() => setActiveJob(job)}>
                    <UI.TableCell>
                      {job?.name || ''}
                    </UI.TableCell>
                    <UI.TableCell>
                      <DateLabel dateString={job.createdAt} />
                    </UI.TableCell>
                    <UI.TableCell>
                      {job.updatedAt 
                      ? <DateLabel dateString={job.updatedAt} />
                      : 'Not updated yet'  
                    }
                    </UI.TableCell>
                    <UI.TableCell>
                      <DeliveryStatus
                        job={job}
                      />
                    </UI.TableCell>
                  </UI.TableRow>
                ))}
              </UI.TableBody>
            </UI.Table>
          </UI.Div>
          {(data?.getAutodeckJobs?.pageInfo?.nrPages || 0) > 1 && (
            <UI.PaginationFooter>
              <UI.Div style={{ lineHeight: 'normal' }}>
                Showing page
                <UI.Span ml={1} fontWeight="bold">
                  {(paginationState.pageIndex || 0) + 1}
                </UI.Span>
                <UI.Span ml={1}>
                  out of
                </UI.Span>
                <UI.Span ml={1} fontWeight="bold">
                  {data?.getAutodeckJobs?.pageInfo?.nrPages}
                </UI.Span>
              </UI.Div>

              <UI.Div>
                <UI.Stack isInline>
                  <UI.Button
                    onClick={() => setPaginationState(state => ({
                      ...state,

                        pageIndex: (state.pageIndex || 0) - 1,
                        offset: (state.offset || 0) - (state.limit || 0),

                    }))}
                    isDisabled={paginationState.pageIndex === 0}>Previous</UI.Button>
                  <UI.Button
                    onClick={() => setPaginationState(state => ({
                      ...state,
                        ...state,
                        pageIndex: (state.pageIndex || 0) + 1,
                        offset: (state.offset || 0) + (state.limit || 0),

                    }))}
                    isDisabled={(paginationState.pageIndex || 0) + 1 === data?.getAutodeckJobs?.pageInfo?.nrPages}>Next</UI.Button>
                </UI.Stack>
              </UI.Div>
            </UI.PaginationFooter>
          )}
        </UI.Card>

        <UI.Modal isOpen={isOpenDetailModel} onClose={() => setActiveJob(null)}>
          <UI.Card bg="white" width={600} noHover>
            <UI.CardBody>
              <UI.FormSectionHeader>{t('details')}</UI.FormSectionHeader>
              <UI.Stack mb={4}>
                <UI.Div>
                  <UI.Helper mb={1}>{t('first_name')}</UI.Helper>
                  {activeJob?.name}
                </UI.Div>
                <UI.Div>
                  <UI.Helper mb={1}>{t('last_name')}</UI.Helper>
                  {activeJob?.createdAt}
                </UI.Div>

                <UI.Div>
                  <UI.Helper mb={1}>{t('email')}</UI.Helper>
                  {activeJob?.updatedAt || 'Not updated yet'}
                </UI.Div>
                <UI.Div>
                  <UI.Helper mb={1}>{t('phone')}</UI.Helper>
                  {activeJob?.status}
                </UI.Div>
              </UI.Stack>
            </UI.CardBody>
          </UI.Card>
        </UI.Modal>

        <UI.Modal isOpen={isOpenImportModal} onClose={() => setIsOpenImportModal(false)}>
          <UI.Card bg="white" noHover width={700}>
            <UI.CardBody>
              {/* <ImportDeliveriesForm
                onClose={() => setIsOpenImportModal(false)} /> */}
            </UI.CardBody>
          </UI.Card>
        </UI.Modal>
      </UI.ViewContainer>
    </>
  )
};

export default AutodeckOverview;
