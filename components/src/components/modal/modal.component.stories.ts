import type { Meta, StoryObj } from '@storybook/angular';
import { expect, userEvent, within } from '@storybook/test';
import { ModalComponent } from './modal.component';
import { ButtonComponent } from '../button/button.component';
import { getArgTypes, getMcpContract } from '../../storybook/mcp';

const meta: Meta<ModalComponent> = {
  title: 'Components/Modal',
  component: ModalComponent,
  tags: ['autodocs'],
  parameters: {
    mcp: getMcpContract('modal'),
  },
  argTypes: getArgTypes('modal'),
};

export default meta;
type Story = StoryObj<ModalComponent>;

export const Default: Story = {
  args: { open: true, title: 'Confirm action', size: 'md' },
  render: (args) => ({
    props: { ...args, onClosed: () => console.log('modal closed') },
    moduleMetadata: { imports: [ModalComponent, ButtonComponent] },
    template: `
      <dsb-modal [open]="open" [title]="title" [size]="size" [closeOnBackdrop]="closeOnBackdrop">
        <p>Are you sure you want to delete this item? This action cannot be undone.</p>
        <div modal-footer>
          <dsb-button variant="secondary">Cancel</dsb-button>
          <dsb-button variant="danger">Delete</dsb-button>
        </div>
      </dsb-modal>`,
  }),
};

export const Large: Story = {
  args: { open: true, title: 'Edit profile', size: 'lg' },
  render: (args) => ({
    props: args,
    moduleMetadata: { imports: [ModalComponent, ButtonComponent] },
    template: `
      <dsb-modal [open]="open" [title]="title" [size]="size">
        <div style="display:flex;flex-direction:column;gap:16px;">
          <p style="margin:0;color:var(--ds-decisions-color-text-muted);">Update your profile information below.</p>
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;">
            <div>
              <label for="modal-fn" style="font-size:13px;font-weight:500;display:block;margin-bottom:5px;">First name</label>
              <input id="modal-fn" style="width:100%;height:40px;border:1.5px solid var(--ds-decisions-color-border-control);border-radius:6px;padding:0 12px;font-size:14px;box-sizing:border-box;" value="Jane" />
            </div>
            <div>
              <label for="modal-ln" style="font-size:13px;font-weight:500;display:block;margin-bottom:5px;">Last name</label>
              <input id="modal-ln" style="width:100%;height:40px;border:1.5px solid var(--ds-decisions-color-border-control);border-radius:6px;padding:0 12px;font-size:14px;box-sizing:border-box;" value="Doe" />
            </div>
          </div>
          <div>
            <label for="modal-email" style="font-size:13px;font-weight:500;display:block;margin-bottom:5px;">Email</label>
            <input id="modal-email" style="width:100%;height:40px;border:1.5px solid var(--ds-decisions-color-border-control);border-radius:6px;padding:0 12px;font-size:14px;box-sizing:border-box;" value="jane@example.com" />
          </div>
        </div>
        <div modal-footer>
          <dsb-button variant="secondary">Cancel</dsb-button>
          <dsb-button variant="primary">Save changes</dsb-button>
        </div>
      </dsb-modal>`,
  }),
};

export const Small: Story = {
  args: { open: true, title: 'Session expired', size: 'sm' },
  render: (args) => ({
    props: args,
    moduleMetadata: { imports: [ModalComponent, ButtonComponent] },
    template: `
      <dsb-modal [open]="open" [title]="title" [size]="size">
        <p>Your session has expired. Please sign in again to continue.</p>
        <div modal-footer>
          <dsb-button variant="primary">Sign in</dsb-button>
        </div>
      </dsb-modal>`,
  }),
};

export const NoTitle: Story = {
  args: { open: true, size: 'md', ariaLabel: 'Payment successful' },
  render: (args) => ({
    props: args,
    moduleMetadata: { imports: [ModalComponent, ButtonComponent] },
    template: `
      <dsb-modal [open]="open" [size]="size">
        <div style="text-align:center;padding:8px 0 4px;">
          <div style="width:48px;height:48px;border-radius:50%;background:var(--ds-decisions-color-feedback-success-surface);display:flex;align-items:center;justify-content:center;margin:0 auto 14px;">
            <svg width="22" height="22" viewBox="0 0 22 22" fill="none"><path d="M4 11l5 5L18 6" stroke="var(--ds-decisions-color-feedback-success-text)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
          </div>
          <h3 style="margin:0 0 6px;font-size:16px;font-weight:600;color:var(--ds-decisions-color-text-primary);">Payment successful</h3>
          <p style="margin:0;font-size:14px;color:var(--ds-decisions-color-text-muted);line-height:1.6;">Your subscription has been activated. Check your email for the receipt.</p>
        </div>
        <div modal-footer>
          <dsb-button variant="primary" [fullWidth]="true">Done</dsb-button>
        </div>
      </dsb-modal>`,
  }),
};

/** Interaction test — verify dialog is accessible and close button is functional */
export const Interactive: Story = {
  args: { open: true, title: 'Delete item', size: 'md' },
  render: (args) => ({
    props: args,
    moduleMetadata: { imports: [ModalComponent, ButtonComponent] },
    template: `
      <dsb-modal [open]="open" [title]="title" [size]="size">
        <p>Are you sure you want to delete this item? This action cannot be undone.</p>
        <div modal-footer>
          <dsb-button variant="secondary">Cancel</dsb-button>
          <dsb-button variant="danger">Delete</dsb-button>
        </div>
      </dsb-modal>`,
  }),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Dialog is in the DOM and labelled correctly
    const dialog = canvas.getByRole('dialog');
    expect(dialog).toBeInTheDocument();
    expect(canvas.getByText('Delete item')).toBeInTheDocument();

    // Both action buttons are reachable
    expect(canvas.getByRole('button', { name: /cancel/i })).toBeInTheDocument();
    expect(canvas.getByRole('button', { name: /delete/i })).toBeInTheDocument();

    // Close button is accessible and clickable
    const closeBtn = canvas.getByRole('button', { name: /close modal/i });
    expect(closeBtn).toBeInTheDocument();
    await userEvent.click(closeBtn);
  },
};
