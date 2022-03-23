import { Button } from '@chakra-ui/react';
import { Div, Flex, Text } from '@haas/ui';
import { ReactComponent as ServerDownImage } from 'assets/images/undraw_auth.svg';
import { useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import React from 'react';

const LoggedOutView = () => {
  const { t } = useTranslation();
  const history = useHistory();

  return (
    <Div
      useFlex
      flexDirection="column"
      justifyContent="center"
      height="100vh"
      maxWidth="600px"
      width="100%"
      margin="0 auto"
    >
      <Div mb={100}>
        <Text textAlign="center" color="gray.500" fontSize="2rem" fontWeight="200">
          {t('logged_out')}
        </Text>

        <Flex justifyContent="center" mt={2}>
          <Button onClick={() => history.push('/public/login')}>
            {t('go_to_login')}
          </Button>
        </Flex>

      </Div>
      <Div pt={4} opacity={0.4}>
        <ServerDownImage width="100%" height="auto" />
      </Div>
    </Div>
  );
};

export default LoggedOutView;
