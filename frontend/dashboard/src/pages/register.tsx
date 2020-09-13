import * as qs from 'qs';
import { Div,
  Loader, PageContainer, SubtlePageHeading, SubtlePageSubHeading } from '@haas/ui';
import { Redirect, useLocation } from 'react-router';
import { useMutation, useQuery } from '@apollo/react-hooks';
import { useTranslation } from 'react-i18next';
import React, { useEffect } from 'react';
import formatServerError from 'utils/formatServerError';
import gql from 'graphql-tag';
import styled from 'styled-components/macro';

const verifyUserTokenQuery = gql`
  mutation verifyUserToken($token: String!) {
    verifyUserToken(token: $token) {
      id
      email
    }
  }
`;

const RegisterPageContainer = styled(PageContainer)`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const RegisterPage = () => {
  const location = useLocation();
  const { t } = useTranslation();

  const urlToken: string = qs.parse(location.search, { ignoreQueryPrefix: true })?.token;

  const [verifyUserToken, { loading, data, error, called }] = useMutation(verifyUserTokenQuery);

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
      <RegisterPageContainer>
        <Div>
          <Loader />
        </Div>
      </RegisterPageContainer>
    );
  }

  if (!urlToken) {
    return (
      <RegisterPageContainer>
        <Div>
          <SubtlePageHeading>{t('register:token_not_found')}</SubtlePageHeading>
          <SubtlePageSubHeading>{t('register:token_not_found_helper')}</SubtlePageSubHeading>
        </Div>
      </RegisterPageContainer>
    );
  }

  if (error) {
    return (
      <RegisterPageContainer>
        <Div>
          <SubtlePageHeading>{formatServerError(error.message)}</SubtlePageHeading>
        </Div>
      </RegisterPageContainer>
    );
  }

  return (
    <RegisterPageContainer>
      <Div>
        <SubtlePageHeading>{t('register')}</SubtlePageHeading>
        <SubtlePageSubHeading>{t('register_helper')}</SubtlePageSubHeading>
      </Div>
    </RegisterPageContainer>
  );
};

export default RegisterPage;
