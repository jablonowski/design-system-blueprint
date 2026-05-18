import type { Meta, StoryObj } from '@storybook/angular';
import { DropdownComponent } from './dropdown.component';

const countries = [
  { value: 'us', label: 'United States' },
  { value: 'gb', label: 'United Kingdom' },
  { value: 'de', label: 'Germany' },
  { value: 'fr', label: 'France' },
  { value: 'jp', label: 'Japan' },
];

const meta: Meta<DropdownComponent> = {
  title: 'Components/Dropdown',
  component: DropdownComponent,
  tags: ['autodocs'],
  argTypes: {
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
    disabled: { control: 'boolean' },
    hasError: { control: 'boolean' },
    label: { control: 'text' },
    placeholder: { control: 'text' },
    hint: { control: 'text' },
    errorMessage: { control: 'text' },
  },
};

export default meta;
type Story = StoryObj<DropdownComponent>;

export const Default: Story = {
  args: { options: countries, label: 'Country', placeholder: 'Select a country' },
};

export const WithValue: Story = {
  args: { options: countries, label: 'Country', value: 'de' },
};

export const WithHint: Story = {
  args: {
    options: countries,
    label: 'Country',
    hint: 'This will be used for billing purposes.',
    placeholder: 'Select a country',
  },
};

export const WithError: Story = {
  args: {
    options: countries,
    label: 'Country',
    hasError: true,
    errorMessage: 'Please select a country.',
    placeholder: 'Select a country',
  },
};

export const Disabled: Story = {
  args: { options: countries, label: 'Country', value: 'us', disabled: true },
};

export const Sizes: Story = {
  render: () => ({
    template: `
      <div style="display:flex;flex-direction:column;gap:16px;max-width:280px;padding:8px;">
        <dsb-dropdown [options]="opts" label="Small" size="sm" placeholder="Select..."></dsb-dropdown>
        <dsb-dropdown [options]="opts" label="Medium" size="md" placeholder="Select..."></dsb-dropdown>
        <dsb-dropdown [options]="opts" label="Large" size="lg" placeholder="Select..."></dsb-dropdown>
      </div>`,
    props: { opts: countries },
  }),
};
