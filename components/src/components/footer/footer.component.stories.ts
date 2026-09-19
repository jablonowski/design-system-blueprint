import type { Meta, StoryObj } from '@storybook/angular';
import { expect, userEvent, within } from '@storybook/test';
import { FooterComponent } from './footer.component';
import { getArgTypes, getMcpContract } from '../../storybook/mcp';

const columns = [
  {
    heading: 'Product',
    links: [
      { label: 'Features', href: '/features' },
      { label: 'Pricing', href: '/pricing' },
      { label: 'Changelog', href: '/changelog' },
      { label: 'Roadmap', href: '/roadmap' },
    ],
  },
  {
    heading: 'Developers',
    links: [
      { label: 'Documentation', href: '/docs' },
      { label: 'Components', href: '/components' },
      { label: 'GitHub', href: 'https://github.com' },
    ],
  },
  {
    heading: 'Company',
    links: [
      { label: 'About', href: '/about' },
      { label: 'Blog', href: '/blog' },
      { label: 'Careers', href: '/careers' },
      { label: 'Contact', href: '/contact' },
    ],
  },
];

const legalLinks = [
  { label: 'Privacy Policy', href: '/privacy' },
  { label: 'Terms of Service', href: '/terms' },
];

const meta: Meta<FooterComponent> = {
  title: 'Components/Footer',
  component: FooterComponent,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    mcp: getMcpContract('footer'),
  },
  argTypes: getArgTypes('footer'),
};

export default meta;
type Story = StoryObj<FooterComponent>;

export const Default: Story = {
  args: {
    brandName: 'Blueprint',
    tagline: 'Beautiful components for modern web apps.',
    columns,
    legalLinks,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    expect(canvas.getByRole('contentinfo')).toBeInTheDocument();

    const nav = canvas.getByRole('navigation', { name: /footer navigation/i });
    // Column headings are real headings, so the footer is navigable by heading.
    const headings = within(nav).getAllByRole('heading', { level: 3 });
    expect(headings.map((h) => h.textContent?.trim())).toEqual([
      'Product',
      'Developers',
      'Company',
    ]);

    expect(within(nav).getByRole('link', { name: 'Pricing' })).toHaveAttribute('href', '/pricing');
    expect(canvas.getByRole('link', { name: 'Privacy Policy' })).toBeInTheDocument();
  },
};

export const Minimal: Story = {
  args: {
    brandName: 'Blueprint',
    copyright: '© 2026 Blueprint. All rights reserved.',
    legalLinks,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // No columns means the footer navigation landmark is not rendered at all.
    expect(canvas.queryByRole('navigation', { name: /footer navigation/i })).toBeNull();
    expect(canvas.getByText('© 2026 Blueprint. All rights reserved.')).toBeInTheDocument();
    expect(canvas.getByRole('link', { name: 'Terms of Service' })).toBeInTheDocument();
  },
};

export const WithTagline: Story = {
  args: {
    brandName: 'Acme',
    tagline: 'Building the future, one component at a time.',
    columns: columns.slice(0, 2),
    legalLinks,
  },
};
