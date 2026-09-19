import type { Meta, StoryObj } from '@storybook/angular';
import { expect, userEvent, within } from '@storybook/test';
import { HeaderComponent } from './header.component';
import { getArgTypes, getMcpContract } from '../../storybook/mcp';

const navItems = [
  { label: 'Home', href: '/', active: true },
  { label: 'Products', href: '/products' },
  { label: 'Pricing', href: '/pricing' },
  { label: 'Docs', href: '/docs' },
];

const meta: Meta<HeaderComponent> = {
  title: 'Components/Header',
  component: HeaderComponent,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    mcp: getMcpContract('header'),
  },
  argTypes: getArgTypes('header'),
};

export default meta;
type Story = StoryObj<HeaderComponent>;

export const Default: Story = {
  args: {
    brandName: 'Blueprint',
    navItems,
    ctaLabel: 'Get started',
    ctaHref: '/signup',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    expect(canvas.getByRole('banner')).toBeInTheDocument();

    const nav = canvas.getByRole('navigation', { name: /main navigation/i });
    expect(within(nav).getAllByRole('link')).toHaveLength(4);

    // The active item is communicated to assistive technology, not only in colour.
    expect(within(nav).getByRole('link', { name: 'Home' })).toHaveAttribute('aria-current', 'page');
    expect(within(nav).getByRole('link', { name: 'Docs' })).not.toHaveAttribute('aria-current');

    const cta = canvas.getByRole('link', { name: 'Get started' });
    expect(cta).toHaveAttribute('href', '/signup');

    // Every interactive element in the bar must be reachable by keyboard.
    await userEvent.tab();
    expect(canvasElement.contains(document.activeElement)).toBe(true);
  },
};

export const LogoOnly: Story = {
  args: { brandName: 'Blueprint' },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // No nav items means no empty navigation landmark cluttering the a11y tree.
    expect(canvas.queryByRole('navigation')).toBeNull();
    expect(canvas.getByText('Blueprint')).toBeInTheDocument();
  },
};

export const WithNavNoAction: Story = {
  args: { brandName: 'Blueprint', navItems },
};

export const MinimalBrand: Story = {
  args: { brandName: 'Acme Corp', ctaLabel: 'Sign in', ctaHref: '/login' },
};
