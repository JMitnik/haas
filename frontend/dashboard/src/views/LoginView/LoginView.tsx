import * as UI from '@haas/ui';
import { useForm } from 'react-hook-form';
import { useHistory } from 'react-router';
import React from 'react';

import { LogoThumbnail } from 'components/Logo';
import { useDocumentTitle } from 'hooks/useDocumentTitle';
import { useLogger } from 'hooks/useLogger';
import { useRequestInviteMutation } from 'types/generated-types';
import { useToast } from 'hooks/useToast';
import AnimatedRoute from 'components/Routes/AnimatedRoute';
import AnimatedRoutes from 'components/Routes/AnimatedRoutes';
import ServerError from 'components/ServerError';

import * as LS from './LoginView.styles';

interface FormData {
  email: string;
}

const baseRoute = '/public/login';

const LoginView = () => {
  useDocumentTitle('haas | Login');
  const history = useHistory();
  const toast = useToast();
  const logger = useLogger();

  const form = useForm<FormData>({
    mode: 'onChange',
    shouldUnregister: false,
  });

  const [requestInvite, { error: loginServerError, loading: isRequestingInvite }] = useRequestInviteMutation({
    onCompleted: (data) => {
      if (data.requestInvite.didInvite) {
        toast.success({
          title: 'Invite has been sent in case the mail matches!',
          description: 'Check your email for your invitation',
        });

        history.push(`${baseRoute}/waiting`);
      } else {
        history.push(`${baseRoute}/not-exist`);
      }
    },
    onError: (error) => {
      toast.templates.error();

      logger.logError(error, {
        tags: {
          section: 'auth',
        },
        user: {
          email: form.getValues().email,
        },
      });
    },
  });

  const handleRequestInvite = async (data: FormData) => {
    history.push(`${baseRoute}/waiting`);
    // requestInvite({
    //   variables: {
    //     input: { email: data.email },
    //   },
    // });
  };

  const sentEmail = form.watch('email');

  return (
    <LS.FullHeight>
      <UI.Grid height="100%" gridTemplateColumns={['1fr', '1fr', '4fr 3fr']}>
        <UI.Flex height="100%" maxWidth={900} alignItems="center" justifyContent="center" px={[4]}>
          <AnimatedRoutes>
            <AnimatedRoute exact path={`${baseRoute}`}>
              <UI.Flex alignItems="center" style={{ height: '100%' }}>
                <UI.Form onSubmit={form.handleSubmit(handleRequestInvite)}>
                  <UI.Div maxWidth={500}>
                    <LogoThumbnail />
                    <UI.H3 mt={4} color="off.600" fontWeight={800}>Sign in with your email</UI.H3>
                    <UI.Paragraph color="off.500">
                      Enter your email and we will send you a login link to access the dashboard.
                    </UI.Paragraph>
                    <UI.Div mt={4}>
                      <UI.FormControl mb={4}>
                        <UI.FormLabel htmlFor="email">Email</UI.FormLabel>
                        <UI.Input name="email" ref={form.register()} />
                      </UI.FormControl>
                      <UI.Button width="100%" variantColor="main" type="submit">
                        Continue
                      </UI.Button>
                    </UI.Div>
                  </UI.Div>
                </UI.Form>
              </UI.Flex>
            </AnimatedRoute>

            <AnimatedRoute exact path={`${baseRoute}/waiting`}>
              <UI.Flex height="100%" alignItems="center" maxWidth={500}>
                Test
              </UI.Flex>
            </AnimatedRoute>
          </AnimatedRoutes>
        </UI.Flex>

        <LS.LoginFeatures display={['none', 'none', 'block']}>
          <UI.Flex height="100%" alignItems="center" justifyContent="center">
            <UI.Div px={4} py={100} maxWidth={750}>
              <img src="/assets/images/login-feature-1.svg" alt="Login feature 1" />

              <UI.Div mt={75}>
                <UI.H2 color="white" fontWeight={800} textAlign="center">
                  Observable insights
                </UI.H2>
                <UI.Paragraph color="white" textAlign="center">
                  The haas dashboard makes observing and maintaining the happiness of your accessible and observable.
                </UI.Paragraph>
              </UI.Div>
            </UI.Div>
          </UI.Flex>
        </LS.LoginFeatures>
      </UI.Grid>
    </LS.FullHeight>
  );
};

export default LoginView;
