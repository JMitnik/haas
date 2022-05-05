import * as UI from '@haas/ui';
import * as qs from 'qs';
import { gql, useMutation } from '@apollo/client';
import { useHistory, useLocation } from 'react-router';

import { useUser } from 'providers/UserProvider';
import React, { useEffect, useRef } from 'react';
import formatServerError from 'utils/formatServerError';

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

export const VerifyTokenView = () => {
  const location = useLocation();
  const history = useHistory();
  const { setAccessToken, isLoggedIn, user } = useUser();
  const verifiedRef = useRef(false);

  const [verifyUserToken, { loading, error }] = useMutation(verifyUserTokenQuery, {
    onCompleted: (data) => {
      setAccessToken(data.verifyUserToken.accessToken);
    },
  });

  useEffect(() => {
    if (isLoggedIn) {
      if (!user?.firstName) {
        history.push('/dashboard/first_time');
      } else {
        history.push('/dashboard');
      }
    }
  }, [isLoggedIn, user, history]);

  useEffect(() => {
    const urlToken = qs.parse(location.search, { ignoreQueryPrefix: true })?.token;

    if (urlToken && !verifiedRef.current && !user) {
      verifiedRef.current = true;

      verifyUserToken({
        variables: {
          token: urlToken,
        },
      });
    }
  }, [verifyUserToken, user, location.search]);

  if (loading) {
    return (
      <UI.Flex alignItems="center" justifyContent="center">
        <UI.Div>
          <UI.Loader />
        </UI.Div>
      </UI.Flex>
    );
  }

  if (error) {
    return (
      <UI.Flex alignItems="center" justifyContent="center">
        <UI.Div>
          <UI.SubtlePageHeading>{formatServerError(error.message)}</UI.SubtlePageHeading>
        </UI.Div>
      </UI.Flex>
    );
  }

  return (
    <UI.Flex alignItems="center" justifyContent="center" />
  );
};
