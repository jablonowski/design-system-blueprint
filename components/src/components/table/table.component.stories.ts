import type { Meta, StoryObj } from '@storybook/angular';
import { TableComponent } from './table.component';
import { ColumnDefDirective } from './column-def.directive';
import { AvatarComponent } from '../avatar/avatar.component';
import { TagComponent } from '../tag/tag.component';
import { ButtonComponent } from '../button/button.component';
import { getArgTypes, getMcpContract } from '../../storybook/mcp';

const meta: Meta<TableComponent> = {
  title: 'Components/Table',
  component: TableComponent,
  tags: ['autodocs'],
  parameters: {
    mcp: getMcpContract('table'),
  },
  argTypes: getArgTypes('table'),
};

export default meta;
type Story = StoryObj<TableComponent>;

const users = [
  { name: 'Alice Brown',   email: 'alice@example.com',  role: 'Admin',  status: 'Active',   joined: 'Jan 2024' },
  { name: 'Bob Smith',     email: 'bob@example.com',    role: 'Editor', status: 'Active',   joined: 'Mar 2024' },
  { name: 'Carol White',   email: 'carol@example.com',  role: 'Viewer', status: 'Inactive', joined: 'Jun 2024' },
  { name: 'Dan Torres',    email: 'dan@example.com',    role: 'Editor', status: 'Active',   joined: 'Aug 2024' },
  { name: 'Eva Nguyen',    email: 'eva@example.com',    role: 'Admin',  status: 'Pending',  joined: 'Nov 2024' },
];

export const UsersTable: Story = {
  render: () => ({
    moduleMetadata: { imports: [TableComponent, ColumnDefDirective, AvatarComponent, TagComponent, ButtonComponent] },
    props: { users },
    template: `
      <dsb-table [rows]="users" [hoverable]="true">
        <dsb-column key="name" header="Name" width="260px">
          <ng-template #cell let-name let-row="row">
            <div style="display:flex;align-items:center;gap:10px;">
              <dsb-avatar [name]="name" size="sm"></dsb-avatar>
              <div>
                <div style="font-weight:500;color:var(--ds-decisions-color-text-primary);">{{ name }}</div>
                <div style="font-size:12px;color:var(--ds-decisions-color-text-subtle);margin-top:1px;">{{ row['email'] }}</div>
              </div>
            </div>
          </ng-template>
        </dsb-column>
        <dsb-column key="role" header="Role"></dsb-column>
        <dsb-column key="status" header="Status">
          <ng-template #cell let-status>
            <dsb-tag
              [variant]="status === 'Active' ? 'success' : status === 'Pending' ? 'warning' : 'default'"
              size="sm"
            >{{ status }}</dsb-tag>
          </ng-template>
        </dsb-column>
        <dsb-column key="joined" header="Joined"></dsb-column>
        <dsb-column key="actions" header="" align="right">
          <ng-template #headerCell><span class="sr-only">Actions</span></ng-template>
          <ng-template #cell>
            <div style="display:flex;gap:6px;justify-content:flex-end;">
              <dsb-button variant="ghost" size="sm">Edit</dsb-button>
              <dsb-button variant="danger" size="sm">Remove</dsb-button>
            </div>
          </ng-template>
        </dsb-column>
      </dsb-table>
    `,
  }),
};

export const Striped: Story = {
  render: () => ({
    moduleMetadata: { imports: [TableComponent, ColumnDefDirective, TagComponent] },
    props: { users },
    template: `
      <dsb-table [rows]="users" [striped]="true" [hoverable]="false">
        <dsb-column key="name"   header="Name"></dsb-column>
        <dsb-column key="role"   header="Role"></dsb-column>
        <dsb-column key="joined" header="Joined"></dsb-column>
        <dsb-column key="status" header="Status">
          <ng-template #cell let-status>
            <dsb-tag [variant]="status === 'Active' ? 'success' : status === 'Pending' ? 'warning' : 'default'" size="sm">{{ status }}</dsb-tag>
          </ng-template>
        </dsb-column>
      </dsb-table>
    `,
  }),
};

export const Loading: Story = {
  render: () => ({
    moduleMetadata: { imports: [TableComponent, ColumnDefDirective] },
    props: { users },
    template: `
      <dsb-table [rows]="users" [loading]="true">
        <dsb-column key="name"   header="Name"></dsb-column>
        <dsb-column key="role"   header="Role"></dsb-column>
        <dsb-column key="status" header="Status"></dsb-column>
      </dsb-table>
    `,
  }),
};

export const Empty: Story = {
  render: () => ({
    moduleMetadata: { imports: [TableComponent, ColumnDefDirective] },
    props: { rows: [] },
    template: `
      <dsb-table [rows]="rows" emptyMessage="No users found.">
        <dsb-column key="name"   header="Name"></dsb-column>
        <dsb-column key="role"   header="Role"></dsb-column>
        <dsb-column key="status" header="Status"></dsb-column>
      </dsb-table>
    `,
  }),
};
