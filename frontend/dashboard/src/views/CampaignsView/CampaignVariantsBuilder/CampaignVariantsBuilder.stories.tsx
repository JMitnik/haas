import React from 'react';
import { Story, Meta } from '@storybook/react';

import { CampaignVariantsBuilder } from './CampaignVariantsBuilder';
import { ThemeProvider } from '@chakra-ui/core';
import DefaultThemeProviders from 'providers/ThemeProvider';

export default {
  title: 'Campaign/CampaignVariantsBuilder',
  component: CampaignVariantsBuilder,
  argTypes: {
    backgroundColor: { control: 'color' },
  },
} as Meta;

const Template: Story = (args) => <DefaultThemeProviders><CampaignVariantsBuilder {...args} /></DefaultThemeProviders>;

export const Primary = Template.bind({});
Primary.args = {
};

export const Secondary = Template.bind({});
Secondary.args = {
};

export const Large = Template.bind({});
Large.args = {
};

export const Small = Template.bind({});
Small.args = {
};
