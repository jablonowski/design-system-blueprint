import type { Meta, StoryObj } from '@storybook/angular';
import { BreadcrumbsComponent } from './breadcrumbs.component';

const meta: Meta<BreadcrumbsComponent> = {
  title: 'Components/Breadcrumbs',
  component: BreadcrumbsComponent,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<BreadcrumbsComponent>;

export const Default: Story = {
  args: {
    items: [
      { label: 'Home', href: '/' },
      { label: 'Products', href: '/products' },
      { label: 'Design System' },
    ],
  },
};

export const Short: Story = {
  args: {
    items: [
      { label: 'Home', href: '/' },
      { label: 'Settings' },
    ],
  },
};

export const Deep: Story = {
  args: {
    items: [
      { label: 'Home', href: '/' },
      { label: 'Workspace', href: '/workspace' },
      { label: 'Projects', href: '/workspace/projects' },
      { label: 'Design System', href: '/workspace/projects/design-system' },
      { label: 'Components' },
    ],
  },
};

export const RootOnly: Story = {
  args: {
    items: [{ label: 'Dashboard' }],
  },
};
