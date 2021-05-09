import * as UI from '@haas/ui';
import { debounce } from 'lodash';
import { useHistory } from 'react-router';
import React, { useCallback, useEffect, useState } from 'react';
import { useNavigator } from 'hooks/useNavigator';
import { Div, Flex, PageTitle, Text } from '@haas/ui';
import { Plus, ArrowLeft } from 'react-feather';
import { useTranslation } from 'react-i18next';
import { useGetWorkspaceAdminsQuery } from 'types/generated-types';
import styled, { css } from 'styled-components';
import SearchBar from 'components/SearchBar/SearchBar';

const TableHeaderContainer = styled(UI.TableHeading)`
  background: red;
`;

const AdminOverview = () => {
  const { t } = useTranslation();
  const history = useHistory();
  //const { customerSlug } = useNavigator();

  const customerSlug = 'nullinc';
  const { data } = useGetWorkspaceAdminsQuery({
    fetchPolicy: 'cache-and-network',
    variables: {
      customerSlug,
    },
  });
  console.log(data?.users);

  const test = () => {
    let gp;
    data?.users?.map((it) => {
      console.log(it.id + '  ID');
      console.log(it.firstName + ' FIRST NAME');
      console.log(it.globalPermissions);
      gp = it.globalPermissions;
    });
    console.log(typeof gp);
    let vals = [];
  };
  test();

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

  const [activeSearchTerm, setActiveSearchTerm] = useState('');
  const [debouncedState, setDebouncedState] = useState('');
  const handleChange = (e: any) => {
    setActiveSearchTerm(e.target.value);
    debounce(e.target.value);
  };

  

  return (
    <>
      <UI.ViewHeading>
        <UI.Stack>
          <UI.Stack isInline alignItems="center" spacing={4}>
            <BackButtonContainer onClick={() => history.goBack()}>
              <ArrowLeft />
            </BackButtonContainer>

            <PageTitle>{t('views:admin_overview')}</PageTitle>
            <Flex flexDirection="row" justifyContent="space-between" alignItems="center">
              <UI.Button leftIcon={Plus} size="sm" variantColor="teal">
                {/* {t('adminpanel:editpermission')} */}
                Edit Permission
              </UI.Button>
              <Div ml={500}>
                <SearchBar activeSearchTerm={activeSearchTerm} onSearchTermChange={handleChange} />
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
                <UI.TableHeadingCell>{t('admin:userFName')}</UI.TableHeadingCell>
                <UI.TableHeadingCell>{t('admin:userLName')}</UI.TableHeadingCell>
                <UI.TableHeadingCell>{t('admin:userPermissions')}</UI.TableHeadingCell>
              </TableHeaderContainer>

              <UI.TableBody>
                {data?.users?.map((item) => (
                  <UI.TableRow hasHover key={item.id}>
                    <UI.TableCell>{item?.id || ''}</UI.TableCell>
                    <UI.TableCell>{item?.firstName || ''}</UI.TableCell>
                    <UI.TableCell>{item?.lastName || ''}</UI.TableCell>
                    {/* <UI.TableCell>Dummy Data</UI.TableCell> */}
                    <UI.TableCell
                      style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}
                    >
                      CAN_ACCESS_ADMIN_PANEL
                    </UI.TableCell>
                    {/* <UI.TableCell>{item?.globalPermissions || ''}</UI.TableCell> */}
                  </UI.TableRow>
                ))}
              </UI.TableBody>
            </UI.Table>
          </UI.Div>
          <UI.PaginationFooter>
            <UI.Div style={{ lineHeight: 'normal' }}>
              Showing page
              <UI.Span ml={1} fontWeight="bold">
                1
              </UI.Span>
              <UI.Span ml={1}>out of</UI.Span>
              <UI.Span ml={1} fontWeight="bold">
                22
              </UI.Span>
            </UI.Div>
            <UI.Div>
              <UI.Stack isInline>
                <UI.Button size="sm" variant="outline" isDisabled={true}>
                  Previous
                </UI.Button>
                <UI.Span ml={1} mt={1} fontWeight="light">
                  1
                </UI.Span>
                <UI.Button size="sm">Next</UI.Button>
              </UI.Stack>
            </UI.Div>
          </UI.PaginationFooter>
        </UI.Card>
      </UI.ViewContainer>
    </>
  );
};

export default AdminOverview;
