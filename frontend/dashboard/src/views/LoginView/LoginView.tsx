import * as UI from '@haas/ui';
import * as yup from 'yup';
import { useForm } from 'react-hook-form';
import { useHistory } from 'react-router';
import { useTranslation } from 'react-i18next';
import { yupResolver } from '@hookform/resolvers';
import React from 'react';

import { LogoThumbnail } from 'components/Logo';
import { View } from 'layouts/View';
import { useLogger } from 'hooks/useLogger';
import { useRequestInviteMutation } from 'types/generated-types';
import { useToast } from 'hooks/useToast';
import AnimatedRoute from 'components/Routes/AnimatedRoute';
import AnimatedRoutes from 'components/Routes/AnimatedRoutes';

import * as LS from './LoginView.styles';

interface FormData {
  email: string;
}

const schema = yup.object().shape({
  email: yup.string().email().required(),
});

const baseRoute = '/public/login';

const LoginView = () => {
  const history = useHistory();
  const toast = useToast();
  const logger = useLogger();
  const { t } = useTranslation();

  const form = useForm<FormData>({
    mode: 'onChange',
    shouldUnregister: false,
    resolver: yupResolver(schema),
  });

  const [requestInvite, { loading: isRequestingInvite }] = useRequestInviteMutation({
    onCompleted: (data) => {
      if (data?.requestInvite?.didInvite) {
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
    requestInvite({
      variables: {
        input: { email: data.email },
      },
    });
  };

  const sentEmail = form.watch('email');

  return (
    <View documentTitle="haas | Login">
      <LS.FullHeight>
        <UI.Grid height="100%" gridTemplateColumns={['1fr', '1fr', '4fr 3fr']}>
          <UI.Flex height="100%" maxWidth={900} alignItems="center" justifyContent="center" px={[4]}>
            <AnimatedRoutes>
              <AnimatedRoute exact path={`${baseRoute}`}>
                <UI.Flex alignItems="center" style={{ height: '100%' }}>
                  <UI.Form onSubmit={form.handleSubmit(handleRequestInvite)}>
                    <UI.Div maxWidth={500}>
                      <LogoThumbnail />
                      <UI.H3 mt={4} color="off.600">
                        {t('login_header')}
                      </UI.H3>
                      <UI.Paragraph color="off.500">
                        {t('login_description')}
                      </UI.Paragraph>
                      <UI.Div mt={4}>
                        <UI.FormControl mb={4}>
                          <UI.FormLabel htmlFor="email">
                            {t('email')}
                          </UI.FormLabel>
                          <UI.Input autoFocus defaultValue={sentEmail} name="email" ref={form.register()} />
                        </UI.FormControl>
                        <UI.Button
                          isDisabled={!form.formState.isValid || isRequestingInvite}
                          width="100%"
                          variantColor="main"
                          type="submit"
                        >
                          {t('continue')}
                        </UI.Button>
                      </UI.Div>
                    </UI.Div>
                  </UI.Form>
                </UI.Flex>
              </AnimatedRoute>

              <AnimatedRoute exact path={`${baseRoute}/not-exist`}>
                <UI.Flex height="100%" alignItems="center" maxWidth={500}>
                  <UI.Div>
                    <UI.H3 color="off.600">
                      {t('whoops')}
                    </UI.H3>
                    <UI.Paragraph color="off.500">
                      {t('user_not_exist', { user: sentEmail })}
                    </UI.Paragraph>

                    <UI.Button onClick={() => history.push(baseRoute)} mt={2}>
                      {t('go_back')}
                    </UI.Button>
                  </UI.Div>
                </UI.Flex>
              </AnimatedRoute>

              <AnimatedRoute exact path={`${baseRoute}/waiting`}>
                <UI.Flex height="100%" alignItems="center" maxWidth={500}>
                  <UI.Div>
                    <UI.H3 color="off.600">
                      {t('general_success')}
                    </UI.H3>
                    <UI.Paragraph color="off.500">
                      {t('user_received_mail', { user: sentEmail })}
                    </UI.Paragraph>

                    <UI.Button onClick={() => history.push(baseRoute)} mt={2}>
                      {t('go_back')}
                    </UI.Button>
                  </UI.Div>
                </UI.Flex>
              </AnimatedRoute>
            </AnimatedRoutes>
          </UI.Flex>

          <LS.LoginFeatures display={['none', 'none', 'block']}>
            <UI.Flex height="100%" alignItems="center" justifyContent="center">
              <UI.Div px={4} maxWidth={750}>
                <img src="/assets/images/login-feature-1.svg" alt="Login feature 1" />

                <UI.Div mt={75}>
                  <UI.H2 color="white" textAlign="center">
                    {t('observable_insights')}
                  </UI.H2>
                  <UI.Paragraph color="white" textAlign="center">
                    {t('observable_insights_description')}
                  </UI.Paragraph>
                </UI.Div>
              </UI.Div>
            </UI.Flex>
          </LS.LoginFeatures>
        </UI.Grid>
      </LS.FullHeight>
    </View>
  );
};

export default LoginView;
