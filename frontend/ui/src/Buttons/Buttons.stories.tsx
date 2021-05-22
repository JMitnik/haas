import React from 'react';
import { Story, Meta } from '@storybook/react';

import { Button } from './Buttons';
import { ThemeProvider } from '@chakra-ui/core';

export default {
    title: 'Buttons/Button',
    component: Button,
  } as Meta;

export const Test = () => <ThemeProvider><Button>Test</Button></ThemeProvider>