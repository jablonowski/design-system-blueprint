import type { Meta, StoryObj } from '@storybook/angular';
import { ListComponent } from './list.component';
import { ListItemComponent } from './list-item.component';
import { AvatarComponent } from '../avatar/avatar.component';
import { TagComponent } from '../tag/tag.component';
import { ButtonComponent } from '../button/button.component';
import { getArgTypes, getMcpContract } from '../../storybook/mcp';

const meta: Meta<ListComponent> = {
  title: 'Components/List',
  component: ListComponent,
  tags: ['autodocs'],
  parameters: {
    mcp: getMcpContract('list'),
  },
  argTypes: getArgTypes('list'),
};

export default meta;
type Story = StoryObj<ListComponent>;

export const Simple: Story = {
  render: () => ({
    moduleMetadata: { imports: [ListComponent, ListItemComponent] },
    template: `
      <div style="max-width:480px;">
        <dsb-list [bordered]="true">
          <dsb-list-item label="Project created" description="The repository was initialised with a default branch."></dsb-list-item>
          <dsb-list-item label="CI pipeline configured" description="GitHub Actions workflow added to the project."></dsb-list-item>
          <dsb-list-item label="First commit pushed" description="Initial codebase committed to the main branch."></dsb-list-item>
          <dsb-list-item label="Code review requested" description="Pull request #1 opened and review assigned."></dsb-list-item>
        </dsb-list>
      </div>`,
  }),
};

export const ActivityLog: Story = {
  render: () => ({
    moduleMetadata: { imports: [ListComponent, ListItemComponent] },
    template: `
      <div style="max-width:560px;">
        <dsb-list [bordered]="true">
          <dsb-list-item
            label="Deployment succeeded"
            description="Production deployed from commit a3f92b1 by alice."
            meta="2 min ago"
            variant="success"
            [indicator]="true"
          ></dsb-list-item>
          <dsb-list-item
            label="Build started"
            description="Running test suite and static analysis."
            meta="4 min ago"
            variant="info"
            [indicator]="true"
          ></dsb-list-item>
          <dsb-list-item
            label="Linting warning"
            description="3 unused variables detected in src/utils.ts."
            meta="5 min ago"
            variant="warning"
            [indicator]="true"
          ></dsb-list-item>
          <dsb-list-item
            label="Test run failed"
            description="2 of 48 unit tests failed — ButtonComponent › should emit onClick."
            meta="12 min ago"
            variant="error"
            [indicator]="true"
          ></dsb-list-item>
          <dsb-list-item
            label="PR merged"
            description="feat: add checkbox and radio components merged into main."
            meta="1 hr ago"
            variant="default"
            [indicator]="true"
          ></dsb-list-item>
        </dsb-list>
      </div>`,
  }),
};

export const WithAvatars: Story = {
  render: () => ({
    moduleMetadata: { imports: [ListComponent, ListItemComponent, AvatarComponent, TagComponent, ButtonComponent] },
    template: `
      <div style="max-width:560px;">
        <dsb-list [bordered]="true">
          <dsb-list-item label="Alice Brown" description="alice@example.com" meta="Admin">
            <dsb-avatar list-leading name="Alice Brown" size="sm"></dsb-avatar>
            <dsb-tag list-trailing variant="success" size="sm">Active</dsb-tag>
          </dsb-list-item>
          <dsb-list-item label="Bob Smith" description="bob@example.com" meta="Editor">
            <dsb-avatar list-leading name="Bob Smith" size="sm"></dsb-avatar>
            <dsb-tag list-trailing variant="success" size="sm">Active</dsb-tag>
          </dsb-list-item>
          <dsb-list-item label="Carol White" description="carol@example.com" meta="Viewer">
            <dsb-avatar list-leading name="Carol White" size="sm"></dsb-avatar>
            <dsb-tag list-trailing variant="default" size="sm">Inactive</dsb-tag>
          </dsb-list-item>
          <dsb-list-item label="Dan Torres" description="dan@example.com" meta="Editor">
            <dsb-avatar list-leading name="Dan Torres" size="sm"></dsb-avatar>
            <dsb-tag list-trailing variant="warning" size="sm">Pending</dsb-tag>
          </dsb-list-item>
        </dsb-list>
      </div>`,
  }),
};

export const WithActions: Story = {
  render: () => ({
    moduleMetadata: { imports: [ListComponent, ListItemComponent, TagComponent, ButtonComponent] },
    template: `
      <div style="max-width:580px;">
        <dsb-list [bordered]="true">
          <dsb-list-item label="Design tokens" description="Color, spacing, typography and elevation variables.">
            <dsb-tag list-trailing variant="info" size="sm">v2.1</dsb-tag>
            <dsb-button list-trailing variant="ghost" size="sm">Edit</dsb-button>
          </dsb-list-item>
          <dsb-list-item label="Button component" description="Primary, secondary, ghost and danger variants.">
            <dsb-tag list-trailing variant="success" size="sm">Stable</dsb-tag>
            <dsb-button list-trailing variant="ghost" size="sm">Edit</dsb-button>
          </dsb-list-item>
          <dsb-list-item label="Data table" description="Sortable columns, custom cell templates.">
            <dsb-tag list-trailing variant="warning" size="sm">Beta</dsb-tag>
            <dsb-button list-trailing variant="ghost" size="sm">Edit</dsb-button>
          </dsb-list-item>
        </dsb-list>
      </div>`,
  }),
};

export const Compact: Story = {
  render: () => ({
    moduleMetadata: { imports: [ListComponent, ListItemComponent] },
    template: `
      <div style="max-width:400px;">
        <dsb-list [bordered]="true" [compact]="true">
          <dsb-list-item label="node_modules excluded" [indicator]="true"></dsb-list-item>
          <dsb-list-item label="dist/ excluded" [indicator]="true"></dsb-list-item>
          <dsb-list-item label=".storybook/ tracked" variant="success" [indicator]="true"></dsb-list-item>
          <dsb-list-item label="package-lock.json tracked" variant="success" [indicator]="true"></dsb-list-item>
          <dsb-list-item label=".env missing" variant="error" [indicator]="true"></dsb-list-item>
        </dsb-list>
      </div>`,
  }),
};
