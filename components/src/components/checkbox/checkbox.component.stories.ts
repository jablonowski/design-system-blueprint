import type { Meta, StoryObj } from '@storybook/angular';
import { CheckboxComponent } from './checkbox.component';

const meta: Meta<CheckboxComponent> = {
  title: 'Components/Checkbox',
  component: CheckboxComponent,
  tags: ['autodocs'],
  argTypes: {
    checked: { control: 'boolean' },
    disabled: { control: 'boolean' },
    hasError: { control: 'boolean' },
    label: { control: 'text' },
    hint: { control: 'text' },
    errorMessage: { control: 'text' },
  },
};

export default meta;
type Story = StoryObj<CheckboxComponent>;

export const Default: Story = {
  args: { label: 'Accept terms and conditions', checked: false },
};

export const Checked: Story = {
  args: { label: 'Subscribe to newsletter', checked: true },
};

export const WithHint: Story = {
  args: {
    label: 'Enable notifications',
    hint: 'You can change this in settings at any time.',
    checked: false,
  },
};

export const WithError: Story = {
  args: {
    label: 'Accept terms and conditions',
    hasError: true,
    errorMessage: 'You must accept the terms to continue.',
    checked: false,
  },
};

export const Disabled: Story = {
  args: { label: 'This option is unavailable', disabled: true, checked: false },
};

export const DisabledChecked: Story = {
  args: { label: 'Already enabled', disabled: true, checked: true },
};

export const Group: Story = {
  render: () => ({
    template: `
      <div style="display:flex;flex-direction:column;gap:10px;padding:8px;">
        <dsb-checkbox label="HTML"></dsb-checkbox>
        <dsb-checkbox label="CSS" [checked]="true"></dsb-checkbox>
        <dsb-checkbox label="JavaScript" [checked]="true"></dsb-checkbox>
        <dsb-checkbox label="TypeScript"></dsb-checkbox>
      </div>`,
  }),
};
