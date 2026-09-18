import type { Meta, StoryObj } from '@storybook/angular';
import { TagComponent } from './tag.component';
import { getArgTypes, getMcpContract } from '../../storybook/mcp';

const meta: Meta<TagComponent> = {
  title: 'Components/Tag',
  component: TagComponent,
  tags: ['autodocs'],
  parameters: {
    mcp: getMcpContract('tag'),
  },
  argTypes: getArgTypes('tag'),
};

export default meta;
type Story = StoryObj<TagComponent>;

export const Default: Story = {
  args: { variant: 'default', size: 'md' },
  render: (args) => ({
    props: args,
    template: `<dsb-tag [variant]="variant" [size]="size">Label</dsb-tag>`,
  }),
};

export const AllVariants: Story = {
  render: () => ({
    template: `
      <div style="display:flex;flex-wrap:wrap;gap:8px;padding:8px;align-items:center;">
        <dsb-tag variant="default">Default</dsb-tag>
        <dsb-tag variant="primary">Primary</dsb-tag>
        <dsb-tag variant="success">Success</dsb-tag>
        <dsb-tag variant="warning">Warning</dsb-tag>
        <dsb-tag variant="danger">Danger</dsb-tag>
        <dsb-tag variant="info">Info</dsb-tag>
      </div>`,
  }),
};

export const Sizes: Story = {
  render: () => ({
    template: `
      <div style="display:flex;gap:8px;padding:8px;align-items:center;">
        <dsb-tag variant="primary" size="sm">Small</dsb-tag>
        <dsb-tag variant="primary" size="md">Medium</dsb-tag>
      </div>`,
  }),
};

export const InContext: Story = {
  render: () => ({
    template: `
      <div style="display:flex;flex-direction:column;gap:12px;padding:8px;">
        <div style="display:flex;align-items:center;gap:8px;font-size:14px;font-family:inherit;">
          <span>Design system release</span>
          <dsb-tag variant="success">Stable</dsb-tag>
        </div>
        <div style="display:flex;align-items:center;gap:8px;font-size:14px;font-family:inherit;">
          <span>Pending review</span>
          <dsb-tag variant="warning">In progress</dsb-tag>
        </div>
        <div style="display:flex;align-items:center;gap:8px;font-size:14px;font-family:inherit;">
          <span>Build failed</span>
          <dsb-tag variant="danger">Error</dsb-tag>
        </div>
      </div>`,
  }),
};
