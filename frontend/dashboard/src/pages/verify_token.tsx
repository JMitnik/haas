import * as qs from 'qs';
import { Div,
  Loader, PageContainer, SubtlePageHeading, SubtlePageSubHeading } from '@haas/ui';
import { useAuth } from 'providers/AuthProvider';
import { useLocation } from 'react-router';
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
        email
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
  const { t } = useTranslation();
  const { setAccessToken, setUser } = useAuth();

  const urlToken: string = qs.parse(location.search, { ignoreQueryPrefix: true })?.token;

  const [verifyUserToken, { loading, data, error }] = useMutation(verifyUserTokenQuery, {
    onCompleted: (data) => {
      setAccessToken(data.verifyUserToken.accessToken);
      setUser(data.userData);
    },
  });

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

  if (data) {
    return (
      <VerifyTokenPageContainer>
        <Div>
          <SubtlePageHeading>{t('register')}</SubtlePageHeading>
          <SubtlePageSubHeading>{t('register_helper')}</SubtlePageSubHeading>
        </Div>
      </VerifyTokenPageContainer>
    );
  }

  return (
    <VerifyTokenPageContainer />
  );
};

export default VerifyTokenPage;
