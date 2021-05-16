import * as UI from '@haas/ui';
import { ArrowLeft, Plus } from 'react-feather';
import { Div, Flex, PageTitle} from '@haas/ui';
import { debounce } from 'lodash';
import styled, { css } from 'styled-components';

import { useHistory } from 'react-router';
import { useTranslation } from 'react-i18next';
import React, { useState } from 'react';

import { PaginationSortByEnum, PaginationWhereInput,
  useGetWorkspaceAdminsQuery, useGetWorkspaceUsersConnectsQuery } from 'types/generated-types';

import SearchBar from 'components/SearchBar/SearchBar';
import { findRenderedComponentWithType } from 'react-dom/test-utils';

const TableHeaderContainer = styled(UI.TableHeading)`
  background: grey !important;
  color: white !important;
`;

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

  interface TableProps{
    startDate: Date | null,
    endDate: Date | null,
    searchTerm: string,
    offset: number,
    limit: number,
    pageIndex: number,
    orderBy: { by: string ; desc: boolean },
  }

  const paginationFilter: PaginationWhereInput = {
  startDate: null,
  endDate: null,
  searchTerm: '',
  offset: 0,
  limit: 8,
  pageIndex: 0,
  orderBy: [{ by: PaginationSortByEnum.Email, desc: true }],
 };


const AdminOverview = () => {
  const { t } = useTranslation();
  const history = useHistory();

  const [paginationState, setPaginationState] = useState(paginationFilter);
  const [activeSearchTerm, setActiveSearchTerm] = useState('');

  const { data } = useGetWorkspaceUsersConnectsQuery({
    fetchPolicy: "cache-and-network",
    variables: {
      filter: paginationState,
    },
  });

  const handleChange = (e: any) => {
    setActiveSearchTerm(e.target.value);
    debounce(e.target.value);
  };

  const renderClickDropdown = ()=>{
    console.log("cell clicked");
    
  }
  
  return (
    <>
      <UI.ViewHeading>
        <UI.Stack>
          <UI.Stack isInline alignItems="center" spacing={4}>
            <BackButtonContainer onClick={() => history.goBack()}>
              <ArrowLeft />
            </BackButtonContainer>

            <PageTitle>{t('views:admin_overview')}</PageTitle>
            <Flex
              flexDirection="row"
              justifyContent="space-between"
              alignItems="center"
            >
              <UI.Button leftIcon={Plus} size="sm" variantColor="teal">
                Edit Permission
              </UI.Button>
              <Div ml={500}>
                <SearchBar
                  activeSearchTerm={activeSearchTerm}
                  onSearchTermChange={handleChange}
                />
              </Div>
            </Flex>
          </UI.Stack>
        </UI.Stack>
      </UI.ViewHeading>

      <UI.ViewContainer>
        <UI.Card noHover>
          <UI.Div p={2}>
            <UI.Table width="100%">
              <TableHeaderContainer>
                <UI.TableHeadingCell>{t('admin:userId')}</UI.TableHeadingCell>
                <UI.TableHeadingCell>
                  {t('admin:userFName')}
                </UI.TableHeadingCell>
                <UI.TableHeadingCell>
                  {t('admin:userLName')}
                </UI.TableHeadingCell>
                <UI.TableHeadingCell>
                  {t('admin:userPermissions')}
                </UI.TableHeadingCell>
              </TableHeaderContainer>

              <UI.TableBody>
                {data?.usersConnection?.userCustomers?.map((item) => (
                  <UI.TableRow hasHover key={item.user.id}>
                    <UI.TableCell>{item?.user.id || ''}</UI.TableCell>
                    <UI.TableCell onClick={renderClickDropdown}>{item?.user.firstName || ''}</UI.TableCell>
                    <UI.TableCell>{item?.user.lastName || ''}</UI.TableCell>
                    <UI.TableCell>
                      {item?.user.globalPermissions || ''}
                    </UI.TableCell>
                  </UI.TableRow>
                ))}
              </UI.TableBody>
            </UI.Table>
          </UI.Div>
         {(data?.usersConnection?.pageInfo.nrPages || 0)>1 &&(
            <UI.PaginationFooter>
            <UI.Div style={{ lineHeight: 'normal' }}>
              Showing page
              <UI.Span ml={1} fontWeight="bold">
                {(paginationState.pageIndex || 0) + 1}
              </UI.Span>
              <UI.Span ml={1}>out of</UI.Span>
              <UI.Span ml={1} fontWeight="bold">
                {(data?.usersConnection?.pageInfo.nrPages || 0) + 1}
              </UI.Span>
            </UI.Div>
            <UI.Div>
              <UI.Stack isInline>
                <UI.Button size="sm" variant="outline"
                onClick={() => setPaginationState(state => ({
                      ...state,

                      pageIndex: (state.pageIndex || 0) - 1,
                      offset: (state.offset || 0) - (state.limit || 0)

                    }))}
                isDisabled={paginationState.pageIndex === 0}>
                  Previous
                </UI.Button>
                <UI.Button size="sm" variant="outline"
                 onClick={() => setPaginationState(state => ({
                      ...state,

                      pageIndex: (state.pageIndex || 0) + 1,
                      offset: (state.offset || 0) + (state.limit || 0)
                    }))}
                    isDisabled={(paginationState.pageIndex || 0) + 1 === data?.usersConnection?.pageInfo.nrPages}>Next</UI.Button>
              </UI.Stack>
            </UI.Div>
          </UI.PaginationFooter>
         )}
        </UI.Card>
      </UI.ViewContainer>
    </>
  );
};

export default AdminOverview;