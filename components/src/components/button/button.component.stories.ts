import type { Meta, StoryObj } from '@storybook/angular';
import { ButtonComponent } from './button.component';

const meta: Meta<ButtonComponent> = {
  title: 'Components/Button',
  component: ButtonComponent,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'ghost', 'danger'],
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
    disabled: { control: 'boolean' },
    loading: { control: 'boolean' },
    fullWidth: { control: 'boolean' },
  },
};

export default meta;
type Story = StoryObj<ButtonComponent>;

export const Primary: Story = {
  args: { variant: 'primary', size: 'md' },
  render: (args) => ({
    props: args,
    template: `<dsb-button [variant]="variant" [size]="size" [disabled]="disabled" [loading]="loading">Save changes</dsb-button>`,
  }),
};

export const Secondary: Story = {
  args: { variant: 'secondary', size: 'md' },
  render: (args) => ({
    props: args,
    template: `<dsb-button [variant]="variant" [size]="size" [disabled]="disabled">Cancel</dsb-button>`,
  }),
};

export const Ghost: Story = {
  args: { variant: 'ghost', size: 'md' },
  render: (args) => ({
    props: args,
    template: `<dsb-button [variant]="variant" [size]="size">Learn more</dsb-button>`,
  }),
};

export const Danger: Story = {
  args: { variant: 'danger', size: 'md' },
  render: (args) => ({
    props: args,
    template: `<dsb-button [variant]="variant" [size]="size">Delete</dsb-button>`,
  }),
};

export const Sizes: Story = {
  render: () => ({
    template: `
      <div style="display:flex;gap:10px;align-items:center;">
        <dsb-button variant="primary" size="sm">Small</dsb-button>
        <dsb-button variant="primary" size="md">Medium</dsb-button>
        <dsb-button variant="primary" size="lg">Large</dsb-button>
      </div>`,
  }),
};

export const Loading: Story = {
  args: { variant: 'primary', loading: true },
  render: (args) => ({
    props: args,
    template: `<dsb-button [variant]="variant" [loading]="loading">Saving…</dsb-button>`,
  }),
};

export const AllVariants: Story = {
  render: () => ({
    template: `
      <div style="display:flex;flex-wrap:wrap;gap:10px;padding:8px;">
        <dsb-button variant="primary">Primary</dsb-button>
        <dsb-button variant="secondary">Secondary</dsb-button>
        <dsb-button variant="ghost">Ghost</dsb-button>
        <dsb-button variant="danger">Danger</dsb-button>
        <dsb-button variant="primary" [disabled]="true">Disabled</dsb-button>
        <dsb-button variant="primary" [loading]="true">Loading</dsb-button>
      </div>`,
  }),
};
