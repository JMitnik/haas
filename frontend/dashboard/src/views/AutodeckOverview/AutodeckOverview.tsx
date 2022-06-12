/* eslint-disable jsx-a11y/anchor-is-valid */

import * as UI from '@haas/ui';
import { ArrowLeft, Download, Plus, RefreshCcw } from 'react-feather';
import { useHistory } from 'react-router';
import { useTranslation } from 'react-i18next';
import React, { useEffect, useState } from 'react';
import styled, { css } from 'styled-components';

import * as Modal from 'components/Common/Modal';
import {
  CreateWorkspaceJobType,
  JobStatusType,
  PaginationSortByEnum,
  PaginationWhereInput,
  useConfirmWorkspaceJobMutation,
  useCreateWorkspaceJobMutation,
  useGetAutodeckJobsQuery,
  useRetryAutodeckJobMutation,
} from 'types/generated-types';
import { DeepPartial } from 'types/customTypes';
import AutodeckForm from 'views/AutodeckView/Components/AutodeckForm';

import { DateLabel, ProcessingStatus } from './Components';

export const paginationFilter: PaginationWhereInput = {
  limit: 15,
  startDate: undefined,
  endDate: undefined,
  pageIndex: 0,
  offset: 0,
  orderBy: [
    {
      by: PaginationSortByEnum.UpdatedAt,
      desc: true,
    },
  ],
};

const BackButtonContainer = styled(UI.Div)`
  cursor: pointer;
  ${({ theme }) => css`

    color: ${theme.colors.gray[600]};
    svg {
      width: 32px;
      height: auto;
    }

    :hover {
      color: ${theme.colors.gray[900]};
    }
  `}
`;

const POLL_INTERVAL_SECONDS = 20;
const POLL_INTERVAL = POLL_INTERVAL_SECONDS * 1000;

export const AutodeckOverview = () => {
  const [isOpenImportModal, setIsOpenImportModal] = useState(false);
  const [isOpenDetailModel, setIsOpenDetailModel] = useState(false);
  const [activeJob, setActiveJob] = useState<DeepPartial<CreateWorkspaceJobType> | null>(null);
  const { t } = useTranslation();
  const history = useHistory();

  const [paginationState, setPaginationState] = useState(paginationFilter);

  const { data, refetch: refetchAutodeckJobs } = useGetAutodeckJobsQuery({
    fetchPolicy: 'cache-and-network',
    variables: {
      filter: paginationState,
    },
    pollInterval: POLL_INTERVAL,
  });

  const [retryJob, { loading: retryLoading }] = useRetryAutodeckJobMutation({
    onCompleted: () => {
      setIsOpenDetailModel(false);
      setActiveJob(null);
      refetchAutodeckJobs({
        filter: paginationState,
      });
    },
  });

  const [createJob, { loading }] = useCreateWorkspaceJobMutation({
    onError: (err: any) => {
      console.log('ERROR: ', err);
    },
    onCompleted: () => {
      setIsOpenImportModal(false);
      refetchAutodeckJobs({
        filter: paginationState,
      });
    },
  });

  const [confirmJob, { loading: confirmLoading }] = useConfirmWorkspaceJobMutation({
    onCompleted: () => {
      setIsOpenImportModal(false);
      refetchAutodeckJobs({
        filter: paginationState,
      });
    },
  });

  useEffect(() => {
    if (activeJob && activeJob?.status !== 'READY_FOR_PROCESSING') {
      setIsOpenDetailModel(true);
    } else {
      setIsOpenDetailModel(false);
    }
  }, [activeJob, setIsOpenImportModal]);

  const handleActiveJob = (job: DeepPartial<CreateWorkspaceJobType>, status: string) => {
    if (status === 'READY_FOR_PROCESSING') {
      setIsOpenImportModal(true);
    }
    setActiveJob(job);
  };

  return (
    <>
      <UI.ViewHead>
        <UI.Stack>
          <UI.Stack isInline alignItems="center" spacing={4}>
            <BackButtonContainer onClick={() => history.goBack()}>
              <ArrowLeft />
            </BackButtonContainer>
            <UI.DeprecatedViewTitle>Autodeck overview</UI.DeprecatedViewTitle>
            <UI.Button
              leftIcon={Plus}
              onClick={() => setIsOpenImportModal(true)}
              size="sm"
              variantColor="teal"
            >
              {t('autodeck:create_job')}

            </UI.Button>
          </UI.Stack>
        </UI.Stack>
      </UI.ViewHead>
      <UI.ViewContainer>
        <UI.NewCard>
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
                {data?.getAutodeckJobs?.jobs.map((job) => (
                  <UI.TableRow hasHover key={job.id} onClick={() => handleActiveJob(job, job.status)}>
                    <UI.TableCell>
                      {job?.name || ''}
                    </UI.TableCell>
                    <UI.TableCell>
                      <DateLabel dateString={job.createdAt} />
                    </UI.TableCell>
                    <UI.TableCell>
                      {job.updatedAt
                        ? <DateLabel dateString={job.updatedAt} />
                        : 'Not updated yet'}
                    </UI.TableCell>
                    <UI.TableCell>
                      <ProcessingStatus
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
                    onClick={() => setPaginationState((state) => ({
                      ...state,

                      pageIndex: (state.pageIndex || 0) - 1,
                      offset: (state.offset || 0) - (state.limit || 0),

                    }))}
                    isDisabled={paginationState.pageIndex === 0}
                  >
                    Previous
                  </UI.Button>
                  <UI.Button
                    onClick={() => setPaginationState((state) => ({
                      ...state,
                      ...state,
                      pageIndex: (state.pageIndex || 0) + 1,
                      offset: (state.offset || 0) + (state.limit || 0),

                    }))}
                    isDisabled={(paginationState.pageIndex || 0) + 1 === data?.getAutodeckJobs?.pageInfo?.nrPages}
                  >
                    Next
                  </UI.Button>
                </UI.Stack>
              </UI.Div>
            </UI.PaginationFooter>
          )}
        </UI.NewCard>

        <Modal.Root open={isOpenDetailModel} onClose={() => setActiveJob(null)}>
          <UI.NewCard bg="white" width={600}>
            <UI.CardBody>
              <UI.FormSectionHeader>{t('details')}</UI.FormSectionHeader>
              <UI.Stack mb={4}>
                <UI.Div>
                  <UI.Helper mb={1}>{t('autodeck:job_name')}</UI.Helper>
                  {activeJob?.name}
                </UI.Div>
                <UI.Div>
                  <UI.Helper mb={1}>{t('created_at')}</UI.Helper>
                  {activeJob?.createdAt && <DateLabel dateString={activeJob?.createdAt} />}
                </UI.Div>

                <UI.Div>
                  <UI.Helper mb={1}>{t('updated_at')}</UI.Helper>
                  {activeJob?.updatedAt
                    ? <DateLabel dateString={activeJob?.updatedAt} />
                    : 'Not updated yet'}
                </UI.Div>

                {activeJob?.status === JobStatusType.Failed
                  && (
                    <UI.Div>
                      <UI.Helper mb={1}>Error</UI.Helper>
                      {activeJob.errorMessage}
                    </UI.Div>
                  )}
                <UI.Div useFlex justifyContent="space-between">
                  <UI.Div>
                    <UI.Helper mb={1}>{t('status')}</UI.Helper>
                    {activeJob?.status}
                  </UI.Div>
                  {activeJob?.status !== JobStatusType.Failed
                    && (
                      <UI.Button
                        leftIcon={Download}
                        isDisabled={activeJob?.status !== JobStatusType.Completed || !activeJob.resourcesUrl}
                        size="sm"
                        variantColor="green"
                      >
                        {activeJob?.resourcesUrl
                          ? (
                            <a
                              style={{ color: 'white', textDecoration: 'none' }}
                              href={activeJob?.resourcesUrl}
                              download
                            >
                              {t('autodeck:download_result')}
                            </a>
                          )
                          : t('autodeck:download_result')}
                      </UI.Button>
                    )}

                  {activeJob?.status === JobStatusType.Failed
                    && (
                      <UI.Button
                        isDisabled={retryLoading}
                        onClick={() => retryJob({
                          variables: {
                            jobId: activeJob?.id,
                          },
                        })}
                        leftIcon={RefreshCcw}
                        size="sm"
                        variantColor="red"
                      >
                        Retry
                      </UI.Button>
                    )}

                </UI.Div>
              </UI.Stack>
            </UI.CardBody>
          </UI.NewCard>
        </Modal.Root>

        <Modal.Root
          open={isOpenImportModal}
          onClose={() => {
            setIsOpenImportModal(false);
            setActiveJob(null);
          }}
        >
          <UI.NewCard bg="white" overflowY="scroll" height={800} width={1200}>
            <UI.CardBody>
              <AutodeckForm
                job={activeJob}
                isLoading={loading}
                isInEditing={activeJob?.status === 'READY_FOR_PROCESSING'}
                onCreateJob={createJob}
                onConfirmJob={confirmJob}
                isConfirmLoading={confirmLoading}
                onClose={() => setIsOpenImportModal(false)}
              />
            </UI.CardBody>
          </UI.NewCard>
        </Modal.Root>
      </UI.ViewContainer>
    </>
  );
};

export default AutodeckOverview;
