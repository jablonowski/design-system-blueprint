import type { Meta, StoryObj } from '@storybook/angular';
import { HeaderComponent } from './header.component';

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
  },
  argTypes: {
    brandName: { control: 'text' },
    logoHref: { control: 'text' },
    ctaLabel: { control: 'text' },
    ctaHref: { control: 'text' },
  },
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
};

export const LogoOnly: Story = {
  args: { brandName: 'Blueprint' },
};

export const WithNavNoAction: Story = {
  args: { brandName: 'Blueprint', navItems },
};

export const MinimalBrand: Story = {
  args: { brandName: 'Acme Corp', ctaLabel: 'Sign in', ctaHref: '/login' },
};
