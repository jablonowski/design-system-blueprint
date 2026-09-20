import type { Meta, StoryObj } from '@storybook/angular';
import { expect, userEvent, within } from '@storybook/test';
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
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // The set is a labelled group, so the question is announced with each option.
    const group = canvas.getByRole('group', { name: /choose a plan/i });
    expect(group).toBeInTheDocument();

    // The accessible name is the label joined to its hint — "Free" reads as
    // "FreeUp to 3 projects". An unanchored /pro/i therefore also matches
    // "...3 projects", so these are anchored to the label.
    const free = canvas.getByRole('radio', { name: /^Free/ });
    const pro = canvas.getByRole('radio', { name: /^Pro/ });

    expect(free).toBeChecked();
    expect(pro).not.toBeChecked();

    // The native input is visually hidden and has pointer-events: none, so it is never
    // the click target. A user clicks the label, and so does this test.
    await userEvent.click(canvas.getByText('Pro'));

    expect(pro).toBeChecked();
    expect(free).not.toBeChecked();
  },
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
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const radios = canvas.getAllByRole('radio');

    radios.forEach((radio) => expect(radio).toBeDisabled());

    // Not merely greyed out: the item is taken out of the pointer flow, so a click never
    // reaches the control, and the selected value stays put.
    expect(canvas.getByRole('radio', { name: /^Pro/ })).toBeChecked();

    const item = canvasElement.querySelector('.radio-item--disabled');
    expect(item).not.toBeNull();
    expect(window.getComputedStyle(item as Element).pointerEvents).toBe('none');

    // The other half — that a programmatic change is refused as well — is asserted in
    // the unit tests, where the event can be driven without fighting the pointer layer.
  },
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
