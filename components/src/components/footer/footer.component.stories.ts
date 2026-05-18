import type { Meta, StoryObj } from '@storybook/angular';
import { FooterComponent } from './footer.component';

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
  },
  argTypes: {
    brandName: { control: 'text' },
    tagline: { control: 'text' },
    copyright: { control: 'text' },
    logoHref: { control: 'text' },
  },
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
};

export const Minimal: Story = {
  args: {
    brandName: 'Blueprint',
    copyright: '© 2026 Blueprint. All rights reserved.',
    legalLinks,
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
