import type { Meta, StoryObj } from '@storybook/angular';
import { InputComponent } from './input.component';
import { getArgTypes, getMcpContract } from '../../storybook/mcp';

const meta: Meta<InputComponent> = {
  title: 'Components/Input',
  component: InputComponent,
  tags: ['autodocs'],
  parameters: {
    mcp: getMcpContract('input'),
  },
  argTypes: getArgTypes('input'),
};

export default meta;
type Story = StoryObj<InputComponent>;

export const Default: Story = {
  args: {
    label: 'Full name',
    placeholder: 'Enter your name',
    size: 'md',
  },
};

export const WithHint: Story = {
  args: {
    label: 'Username',
    placeholder: 'e.g. john_doe',
    hint: 'Only letters, numbers and underscores.',
    size: 'md',
  },
};

export const WithError: Story = {
  args: {
    label: 'Email',
    placeholder: 'you@example.com',
    type: 'email',
    hasError: true,
    errorMessage: 'Please enter a valid email address.',
    size: 'md',
  },
};

export const Password: Story = {
  args: {
    label: 'Password',
    placeholder: '••••••••',
    type: 'password',
    size: 'md',
  },
};

export const Disabled: Story = {
  args: {
    label: 'API key',
    placeholder: 'sk-...',
    disabled: true,
    size: 'md',
  },
};

export const NoLabel: Story = {
  args: {
    placeholder: 'Search…',
    type: 'search',
    size: 'md',
  },
};

export const Sizes: Story = {
  render: () => ({
    template: `
      <div style="display:flex;flex-direction:column;gap:12px;max-width:320px;padding:8px;">
        <dsb-input label="Small" placeholder="Small input" size="sm"></dsb-input>
        <dsb-input label="Medium" placeholder="Medium input" size="md"></dsb-input>
        <dsb-input label="Large" placeholder="Large input" size="lg"></dsb-input>
      </div>`,
  }),
};
