import type { Meta, StoryObj } from '@storybook/angular';
import { RadioGroupComponent } from './radio.component';
import { getArgTypes, getMcpContract } from '../../storybook/mcp';

const options = [
  { value: 'free', label: 'Free', hint: 'Up to 3 projects' },
  { value: 'pro', label: 'Pro', hint: '$12 / month' },
  { value: 'team', label: 'Team', hint: '$49 / month' },
];

const meta: Meta<RadioGroupComponent> = {
  title: 'Components/RadioGroup',
  component: RadioGroupComponent,
  tags: ['autodocs'],
  parameters: {
    mcp: getMcpContract('radioGroup'),
  },
  argTypes: getArgTypes('radioGroup'),
};

export default meta;
type Story = StoryObj<RadioGroupComponent>;

export const Default: Story = {
  args: { options, legend: 'Choose a plan', value: 'free' },
};

export const Inline: Story = {
  args: {
    options: [
      { value: 'light', label: 'Light' },
      { value: 'dark', label: 'Dark' },
      { value: 'system', label: 'System' },
    ],
    legend: 'Appearance',
    value: 'system',
    inline: true,
  },
};

export const WithError: Story = {
  args: {
    options,
    legend: 'Choose a plan',
    hasError: true,
    errorMessage: 'Please select a plan to continue.',
  },
};

export const Disabled: Story = {
  args: { options, legend: 'Choose a plan', value: 'pro', disabled: true },
};

export const WithDisabledOption: Story = {
  args: {
    options: [
      { value: 'basic', label: 'Basic' },
      { value: 'pro', label: 'Pro' },
      { value: 'enterprise', label: 'Enterprise', hint: 'Contact sales', disabled: true },
    ],
    legend: 'Plan',
    value: 'basic',
  },
};
