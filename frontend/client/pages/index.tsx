import * as UI from '@haas/ui';
import Head from 'next/head';
import { motion } from 'framer-motion';
import { ThemeProvider } from 'styled-components';

import { theme } from 'config/theme';

export default function Home() {
  return (
    <div>
      <Head>
        <title>haas: Happiness as a service</title>
        <meta name="description" content="Happiness as a service" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <ThemeProvider theme={theme}>
        <UI.FullScreen bg="primary">
          <UI.Div alignItems="center" useFlex flexDirection="column" justifyContent="center" minHeight="80vh">
            <motion.div initial={{ y: 60, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
              <UI.Div useFlex mb={2} alignItems="flex-end" justifyContent="center">
                <UI.H1 mb={0} fontSize={[40, 100]} textAlign="center" color="white" ml={4}>
                  haas
                </UI.H1>
              </UI.Div>
              <motion.div initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1, transition: { delay: 0.7 } }}>
                <UI.Div justifyContent="center" color="white" display="flex">
                  <UI.Text fontSize="1.7rem" mr={1}>
                    happiness
                  </UI.Text>
                  <motion.span initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1, transition: { delay: 1.2 } }}>
                    <UI.Text fontSize="1.7rem">
                      as a service
                    </UI.Text>
                  </motion.span>
                </UI.Div>
              </motion.div>
            </motion.div>
          </UI.Div>
        </UI.FullScreen>
      </ThemeProvider>
    </div>
  );
}

