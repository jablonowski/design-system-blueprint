import type { Meta, StoryObj } from '@storybook/angular';
import { AvatarComponent } from './avatar.component';
import { getArgTypes, getMcpContract } from '../../storybook/mcp';

const meta: Meta<AvatarComponent> = {
  title: 'Components/Avatar',
  component: AvatarComponent,
  tags: ['autodocs'],
  parameters: {
    mcp: getMcpContract('avatar'),
  },
  argTypes: getArgTypes('avatar'),
};

export default meta;
type Story = StoryObj<AvatarComponent>;

export const Initials: Story = {
  args: { name: 'Jane Doe', size: 'md', shape: 'circle' },
};

export const WithImage: Story = {
  args: {
    src: 'https://i.pravatar.cc/80',
    alt: 'User avatar',
    size: 'md',
    shape: 'circle',
  },
};

export const Rounded: Story = {
  args: { name: 'Blueprint DS', size: 'md', shape: 'rounded' },
};

export const SingleName: Story = {
  args: { name: 'Alex', size: 'md', shape: 'circle' },
};

export const Sizes: Story = {
  render: () => ({
    template: `
      <div style="display:flex;align-items:center;gap:12px;padding:8px;">
        <dsb-avatar name="Jane Doe" size="xs"></dsb-avatar>
        <dsb-avatar name="Jane Doe" size="sm"></dsb-avatar>
        <dsb-avatar name="Jane Doe" size="md"></dsb-avatar>
        <dsb-avatar name="Jane Doe" size="lg"></dsb-avatar>
        <dsb-avatar name="Jane Doe" size="xl"></dsb-avatar>
      </div>`,
  }),
};

export const Group: Story = {
  render: () => ({
    template: `
      <div style="display:flex;align-items:center;padding:8px;">
        <div style="display:flex;">
          <span style="z-index:4;outline:2px solid var(--ds-decisions-color-text-inverse);border-radius:50%;"><dsb-avatar name="Alice B"></dsb-avatar></span>
          <span style="z-index:3;margin-left:-10px;outline:2px solid var(--ds-decisions-color-text-inverse);border-radius:50%;"><dsb-avatar name="Bob C"></dsb-avatar></span>
          <span style="z-index:2;margin-left:-10px;outline:2px solid var(--ds-decisions-color-text-inverse);border-radius:50%;"><dsb-avatar name="Carol D"></dsb-avatar></span>
          <span style="z-index:1;margin-left:-10px;outline:2px solid var(--ds-decisions-color-text-inverse);border-radius:50%;"><dsb-avatar name="Dan E"></dsb-avatar></span>
        </div>
      </div>`,
  }),
};
