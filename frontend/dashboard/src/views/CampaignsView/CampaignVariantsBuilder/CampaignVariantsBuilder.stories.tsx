import { Story, Meta } from '@storybook/react';

import { CampaignVariantsBuilder } from './CampaignVariantsBuilder';
import DefaultThemeProviders from 'providers/ThemeProvider';

export default {
  title: 'Campaign/CampaignVariantsBuilder',
  component: CampaignVariantsBuilder,
  argTypes: {
    backgroundColor: { control: 'color' },
  },
} as Meta;

const Template: Story = (args) => <DefaultThemeProviders><CampaignVariantsBuilder {...args} /></DefaultThemeProviders>;

export const Default = Template.bind({});
Default.args = {
};
