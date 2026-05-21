import type { Meta, StoryObj } from '@storybook/angular';
import { expect, userEvent, within } from '@storybook/test';
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

/** Interaction test — open dropdown, select an option, verify selection */
export const Interactive: Story = {
  args: { options: countries, label: 'Country', placeholder: 'Select a country' },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const trigger = canvas.getByRole('button');

    // Dropdown starts closed
    expect(trigger).toHaveAttribute('aria-expanded', 'false');

    // Open the dropdown
    await userEvent.click(trigger);
    expect(trigger).toHaveAttribute('aria-expanded', 'true');

    // All 5 country options are visible
    const options = canvas.getAllByRole('option');
    expect(options).toHaveLength(countries.length);

    // Select Germany
    const germany = canvas.getByRole('option', { name: 'Germany' });
    await userEvent.click(germany);

    // Dropdown closes after selection
    expect(trigger).toHaveAttribute('aria-expanded', 'false');

    // Trigger label reflects the selected value
    expect(trigger).toHaveTextContent('Germany');
  },
};
