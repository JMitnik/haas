import * as qs from 'qs';
import { Div,
  Loader, PageContainer, SubtlePageHeading, SubtlePageSubHeading } from '@haas/ui';
import { Redirect, useHistory, useLocation } from 'react-router';
import { useAuth } from 'providers/AuthProvider';
import { useMutation } from '@apollo/react-hooks';
import { useTranslation } from 'react-i18next';
import React, { useEffect } from 'react';
import formatServerError from 'utils/formatServerError';
import gql from 'graphql-tag';
import styled from 'styled-components/macro';

const verifyUserTokenQuery = gql`
  mutation verifyUserToken($token: String!) {
    verifyUserToken(token: $token) {
      accessToken
      accessTokenExpiry
      userData {
        id
        firstName
        lastName
        email
        userCustomers {
          role {
            permissions
          }
          customer {
            id
            slug
          }
        }
      }
    }
  }
`;

const VerifyTokenPageContainer = styled(PageContainer)`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const VerifyTokenPage = () => {
  const location = useLocation();
  const history = useHistory();
  const { t } = useTranslation();
  const { setAccessToken, setUser, isLoggedIn, user } = useAuth();

  const urlToken: string = qs.parse(location.search, { ignoreQueryPrefix: true })?.token;

  const [verifyUserToken, { loading, data, error }] = useMutation(verifyUserTokenQuery, {
    onCompleted: (data) => {
      setAccessToken(data.verifyUserToken.accessToken);
      setUser(data.verifyUserToken.userData);
    },
  });

  useEffect(() => {
    if (isLoggedIn) {
      console.log(user.firstName);

      if (!user.firstName) {
        history.push('/dashboard/first_time');
      } else {
        history.push('/dashboard');
      }
    }
  }, [isLoggedIn, user]);

  useEffect(() => {
    if (urlToken) {
      verifyUserToken({
        variables: {
          token: urlToken,
        },
      });
    }
  }, [verifyUserToken, urlToken]);

  if (loading) {
    return (
      <VerifyTokenPageContainer>
        <Div>
          <Loader />
        </Div>
      </VerifyTokenPageContainer>
    );
  }

  if (!urlToken) {
    return (
      <VerifyTokenPageContainer>
        <Div>
          <SubtlePageHeading>{t('register:token_not_found')}</SubtlePageHeading>
          <SubtlePageSubHeading>{t('register:token_not_found_helper')}</SubtlePageSubHeading>
        </Div>
      </VerifyTokenPageContainer>
    );
  }

  if (error) {
    return (
      <VerifyTokenPageContainer>
        <Div>
          <SubtlePageHeading>{formatServerError(error.message)}</SubtlePageHeading>
        </Div>
      </VerifyTokenPageContainer>
    );
  }

  return (
    <VerifyTokenPageContainer />
  );
};

export default VerifyTokenPage;
