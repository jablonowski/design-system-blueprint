import type { Meta, StoryObj } from '@storybook/angular';
import { AccordionComponent } from './accordion.component';
import { AccordionItemComponent } from './accordion-item.component';
import { TagComponent } from '../tag/tag.component';
import { ButtonComponent } from '../button/button.component';

const meta: Meta<AccordionComponent> = {
  title: 'Components/Accordion',
  component: AccordionComponent,
  tags: ['autodocs'],
  argTypes: {
    exclusive: { control: 'boolean' },
  },
};

export default meta;
type Story = StoryObj<AccordionComponent>;

export const Default: Story = {
  render: () => ({
    moduleMetadata: { imports: [AccordionComponent, AccordionItemComponent] },
    template: `
      <div style="max-width:600px;padding:8px;">
        <dsb-accordion>
          <dsb-accordion-item title="What is a design system?" [open]="true">
            A design system is a collection of reusable components, guided by clear standards,
            that can be assembled to build any number of applications.
          </dsb-accordion-item>
          <dsb-accordion-item title="Why use Angular standalone components?">
            Standalone components remove the need for NgModules, making components easier to
            reason about, test, and lazy-load. They import only what they need.
          </dsb-accordion-item>
          <dsb-accordion-item title="How are design tokens managed?">
            Design tokens are stored as JSON files in the design-tokens package and can be
            transformed into CSS custom properties, SCSS variables, or TypeScript constants
            using Style Dictionary.
          </dsb-accordion-item>
          <dsb-accordion-item title="Can I use these components in production?">
            Yes. The library is compiled with ng-packagr and exports FESM2022 bundles with
            full TypeScript type definitions, ready to be consumed by any Angular 19+ project.
          </dsb-accordion-item>
        </dsb-accordion>
      </div>`,
  }),
};

export const Exclusive: Story = {
  render: () => ({
    moduleMetadata: { imports: [AccordionComponent, AccordionItemComponent] },
    template: `
      <div style="max-width:600px;padding:8px;">
        <p style="font-size:13px;color:#888;margin:0 0 16px;">Only one section can be open at a time.</p>
        <dsb-accordion [exclusive]="true">
          <dsb-accordion-item title="Account settings" [open]="true">
            Manage your account details, change your password, and configure two-factor
            authentication from this section.
          </dsb-accordion-item>
          <dsb-accordion-item title="Notifications">
            Choose how and when you receive email and in-app notifications for activity
            across your workspace.
          </dsb-accordion-item>
          <dsb-accordion-item title="Billing & plans">
            View your current plan, update payment methods, and download past invoices.
          </dsb-accordion-item>
        </dsb-accordion>
      </div>`,
  }),
};

export const WithRichContent: Story = {
  render: () => ({
    moduleMetadata: { imports: [AccordionComponent, AccordionItemComponent, TagComponent, ButtonComponent] },
    template: `
      <div style="max-width:620px;padding:8px;">
        <dsb-accordion>
          <dsb-accordion-item title="Release notes — v2.1.0" [open]="true">
            <div style="display:flex;flex-direction:column;gap:12px;">
              <div style="display:flex;align-items:center;gap:8px;">
                <dsb-tag variant="success" size="sm">New</dsb-tag>
                <span>Accordion, Tag, and Avatar components added.</span>
              </div>
              <div style="display:flex;align-items:center;gap:8px;">
                <dsb-tag variant="info" size="sm">Improved</dsb-tag>
                <span>Dropdown now closes on Escape key and outside click.</span>
              </div>
              <div style="display:flex;align-items:center;gap:8px;">
                <dsb-tag variant="warning" size="sm">Deprecated</dsb-tag>
                <span>The <code>onClick</code> output on ButtonComponent will be removed in v3.</span>
              </div>
              <div style="margin-top:4px;">
                <dsb-button variant="secondary" size="sm">View full changelog</dsb-button>
              </div>
            </div>
          </dsb-accordion-item>
          <dsb-accordion-item title="Installation">
            <div style="display:flex;flex-direction:column;gap:10px;">
              <p style="margin:0;">Add the library to your Angular project:</p>
              <pre style="background:#f5f5f5;border-radius:6px;padding:12px;font-size:13px;margin:0;overflow-x:auto;">npm install &#64;blueprint/components</pre>
              <p style="margin:0;">Then import the components you need directly in your standalone component.</p>
            </div>
          </dsb-accordion-item>
          <dsb-accordion-item title="License">
            This project is licensed under the MIT License. You are free to use, modify, and
            distribute it in both personal and commercial projects.
          </dsb-accordion-item>
        </dsb-accordion>
      </div>`,
  }),
};

export const WithDisabled: Story = {
  render: () => ({
    moduleMetadata: { imports: [AccordionComponent, AccordionItemComponent] },
    template: `
      <div style="max-width:600px;padding:8px;">
        <dsb-accordion>
          <dsb-accordion-item title="Available section" [open]="true">
            This section is enabled and can be toggled freely.
          </dsb-accordion-item>
          <dsb-accordion-item title="Restricted section" [disabled]="true">
            You should not be able to open this.
          </dsb-accordion-item>
          <dsb-accordion-item title="Another available section">
            This section is also enabled.
          </dsb-accordion-item>
        </dsb-accordion>
      </div>`,
  }),
};
