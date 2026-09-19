import type { Meta, StoryObj } from '@storybook/angular';
import { expect, userEvent, within } from '@storybook/test';
import { BreadcrumbsComponent } from './breadcrumbs.component';
import { getArgTypes, getMcpContract } from '../../storybook/mcp';

const meta: Meta<BreadcrumbsComponent> = {
  title: 'Components/Breadcrumbs',
  component: BreadcrumbsComponent,
  tags: ['autodocs'],
  parameters: {
    mcp: getMcpContract('breadcrumbs'),
  },
  argTypes: getArgTypes('breadcrumbs'),
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
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // The trail must be a navigation landmark, or a screen reader user cannot jump to it.
    const nav = canvas.getByRole('navigation', { name: /breadcrumb/i });
    expect(nav).toBeInTheDocument();

    // Intermediate crumbs are links; the current page is not.
    expect(canvas.getByRole('link', { name: 'Home' })).toHaveAttribute('href', '/');
    expect(canvas.getByRole('link', { name: 'Products' })).toBeInTheDocument();
    expect(canvas.queryByRole('link', { name: 'Design System' })).toBeNull();

    // The current page is announced as such, not merely styled differently.
    expect(canvas.getByText('Design System')).toHaveAttribute('aria-current', 'page');

    // Chevrons are decorative and must not be read out.
    const separators = canvasElement.querySelectorAll('.breadcrumbs-sep');
    expect(separators).toHaveLength(2);
    separators.forEach((sep) => expect(sep).toHaveAttribute('aria-hidden', 'true'));
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
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // A single crumb is still the current page, and still has no link and no separator.
    expect(canvas.getByText('Dashboard')).toHaveAttribute('aria-current', 'page');
    expect(canvas.queryAllByRole('link')).toHaveLength(0);
    expect(canvasElement.querySelectorAll('.breadcrumbs-sep')).toHaveLength(0);
  },
};
