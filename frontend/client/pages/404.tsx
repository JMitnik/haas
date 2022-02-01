import * as UI from '@haas/ui';
import Image from 'next/image';
import { I18nextProvider, useTranslation } from 'react-i18next';
import { ThemeProvider } from 'styled-components';

import { theme } from '../config/theme';
import { lang } from '../config/language';

const NotFoundPage = () => {
  const { t } = useTranslation();

  return (
    <ThemeProvider theme={theme}>
      <I18nextProvider i18n={lang}>
        <UI.FullScreen>
          <UI.Flex height="100%" alignItems="center" justifyContent="center">
            <UI.ColumnFlex>
              <UI.Div>
                <Image src="/images/404.svg" alt="404" width={450} height={200}/>
              </UI.Div>
              <UI.Span textAlign="center">
                <UI.H1 mb={2}>
                  {t('whoops')}
                </UI.H1>
                <UI.Text>
                  {t('whoops_description')}
                </UI.Text>
              </UI.Span>
            </UI.ColumnFlex>
          </UI.Flex>
        </UI.FullScreen>
      </I18nextProvider>
    </ThemeProvider>
  )
};

export default NotFoundPage;
