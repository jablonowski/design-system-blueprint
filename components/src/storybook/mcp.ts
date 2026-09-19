type ControlType = 'text' | 'boolean' | 'select';

type PropContract = {
  description: string;
  type: string;
  defaultValue?: string;
  control?: ControlType;
  options?: string[];
  deprecated?: string;
};

type EventContract = {
  description: string;
  type: string;
  deprecated?: string;
};

type ComponentContract = {
  name: string;
  selector: string;
  description: string;
  /** Storybook title to source example stories from. Defaults to `Components/<Name>`.
   *  Sub-components are demonstrated inside their parent's stories, not their own. */
  storybookTitle?: string;
  stability: 'stable' | 'beta';
  since: string;
  props: Record<string, PropContract>;
  events?: Record<string, EventContract>;
};

export type ComponentContractKey =
  | 'accordion'
  | 'accordionItem'
  | 'avatar'
  | 'breadcrumbs'
  | 'button'
  | 'checkbox'
  | 'dropdown'
  | 'footer'
  | 'header'
  | 'input'
  | 'list'
  | 'listItem'
  | 'modal'
  | 'radioGroup'
  | 'table'
  | 'tag';

const contracts: Record<ComponentContractKey, ComponentContract> = {
  accordion: {
    name: 'AccordionComponent',
    selector: 'dsb-accordion',
    description: 'Expandable container for multiple accordion items.',
    stability: 'stable',
    since: '1.0.0',
    props: {
      exclusive: {
        description: 'When true, only one item can remain expanded at a time.',
        type: 'boolean',
        defaultValue: 'false',
        control: 'boolean',
      },
    },
  },
  accordionItem: {
    name: 'AccordionItemComponent',
    selector: 'dsb-accordion-item',
    description: 'A single expandable section. Always used inside dsb-accordion.',
    storybookTitle: 'Components/Accordion',
    stability: 'stable',
    since: '1.0.0',
    props: {
      title: {
        description: 'Header text displayed in the toggle button.',
        type: 'string',
        defaultValue: "''",
        control: 'text',
      },
      open: {
        description: 'Initial or controlled open state of the section.',
        type: 'boolean',
        defaultValue: 'false',
        control: 'boolean',
      },
      disabled: {
        description: 'Prevents toggling when true.',
        type: 'boolean',
        defaultValue: 'false',
        control: 'boolean',
      },
    },
  },
  avatar: {
    name: 'AvatarComponent',
    selector: 'dsb-avatar',
    description: 'User avatar with image fallback to initials.',
    stability: 'stable',
    since: '1.0.0',
    props: {
      src: {
        description: 'Image URL. If empty or failing to load, initials are rendered.',
        type: 'string',
        defaultValue: "''",
        control: 'text',
      },
      alt: {
        description: 'Alternative text for the avatar image.',
        type: 'string',
        defaultValue: "''",
        control: 'text',
      },
      name: {
        description: 'Full name used to generate initials fallback.',
        type: 'string',
        defaultValue: "''",
        control: 'text',
      },
      size: {
        description: 'Visual size variant.',
        type: "'xs' | 'sm' | 'md' | 'lg' | 'xl'",
        defaultValue: "'md'",
        control: 'select',
        options: ['xs', 'sm', 'md', 'lg', 'xl'],
      },
      shape: {
        description: 'Avatar shape variant.',
        type: "'circle' | 'rounded'",
        defaultValue: "'circle'",
        control: 'select',
        options: ['circle', 'rounded'],
      },
    },
  },
  breadcrumbs: {
    name: 'BreadcrumbsComponent',
    selector: 'dsb-breadcrumbs',
    description: 'Navigation trail representing current location hierarchy.',
    stability: 'stable',
    since: '1.0.0',
    props: {
      items: {
        description: 'Ordered breadcrumb items. Last item is rendered as current page.',
        type: 'BreadcrumbItem[]',
        defaultValue: '[]',
      },
    },
  },
  button: {
    name: 'ButtonComponent',
    selector: 'dsb-button',
    description: 'Action trigger button with variants and loading state.',
    stability: 'stable',
    since: '1.0.0',
    props: {
      variant: {
        description: 'Visual style variant.',
        type: "'primary' | 'secondary' | 'ghost' | 'danger'",
        defaultValue: "'primary'",
        control: 'select',
        options: ['primary', 'secondary', 'ghost', 'danger'],
      },
      size: {
        description: 'Visual size variant.',
        type: "'sm' | 'md' | 'lg'",
        defaultValue: "'md'",
        control: 'select',
        options: ['sm', 'md', 'lg'],
      },
      disabled: {
        description: 'Disables interaction and applies disabled styles.',
        type: 'boolean',
        defaultValue: 'false',
        control: 'boolean',
      },
      loading: {
        description: 'Shows a spinner and blocks interaction while true.',
        type: 'boolean',
        defaultValue: 'false',
        control: 'boolean',
      },
      fullWidth: {
        description: 'Expands button width to fill its container.',
        type: 'boolean',
        defaultValue: 'false',
        control: 'boolean',
      },
      type: {
        description: 'Native HTML button type attribute.',
        type: "'button' | 'submit' | 'reset'",
        defaultValue: "'button'",
        control: 'select',
        options: ['button', 'submit', 'reset'],
      },
    },
    events: {
      onClick: {
        description: 'Emits native click MouseEvent.',
        type: 'MouseEvent',
        deprecated: 'Use native (click) binding on the component host element.',
      },
    },
  },
  checkbox: {
    name: 'CheckboxComponent',
    selector: 'dsb-checkbox',
    description: 'Single boolean form control with hint and error state.',
    stability: 'stable',
    since: '1.0.0',
    props: {
      label: {
        description: 'Visible label next to checkbox control.',
        type: 'string',
        defaultValue: "''",
        control: 'text',
      },
      checked: {
        description: 'Current checked state.',
        type: 'boolean',
        defaultValue: 'false',
        control: 'boolean',
      },
      disabled: {
        description: 'Disables user interaction.',
        type: 'boolean',
        defaultValue: 'false',
        control: 'boolean',
      },
      hasError: {
        description: 'Toggles error style and semantics.',
        type: 'boolean',
        defaultValue: 'false',
        control: 'boolean',
      },
      errorMessage: {
        description: 'Error text displayed below the control when hasError is true.',
        type: 'string',
        defaultValue: "''",
        control: 'text',
      },
      hint: {
        description: 'Helper text rendered below the control when no error is active.',
        type: 'string',
        defaultValue: "''",
        control: 'text',
      },
      checkboxId: {
        description: 'Explicit input id for label association. Auto-generated when omitted.',
        type: 'string',
        control: 'text',
      },
    },
    events: {
      checkedChange: {
        description: 'Emits whenever checked state changes.',
        type: 'boolean',
      },
    },
  },
  dropdown: {
    name: 'DropdownComponent',
    selector: 'dsb-dropdown',
    description: 'Single-select dropdown form control.',
    stability: 'stable',
    since: '1.0.0',
    props: {
      options: {
        description: 'Available dropdown options.',
        type: 'DropdownOption[]',
        defaultValue: '[]',
      },
      label: {
        description: 'Label shown above the trigger button.',
        type: 'string',
        defaultValue: "''",
        control: 'text',
      },
      placeholder: {
        description: 'Fallback text before a value is selected.',
        type: 'string',
        defaultValue: "'Select an option'",
        control: 'text',
      },
      size: {
        description: 'Visual size variant.',
        type: "'sm' | 'md' | 'lg'",
        defaultValue: "'md'",
        control: 'select',
        options: ['sm', 'md', 'lg'],
      },
      disabled: {
        description: 'Disables interaction.',
        type: 'boolean',
        defaultValue: 'false',
        control: 'boolean',
      },
      hasError: {
        description: 'Enables error style and semantics.',
        type: 'boolean',
        defaultValue: 'false',
        control: 'boolean',
      },
      errorMessage: {
        description: 'Error text rendered below the control.',
        type: 'string',
        defaultValue: "''",
        control: 'text',
      },
      hint: {
        description: 'Helper text shown when no error is active.',
        type: 'string',
        defaultValue: "''",
        control: 'text',
      },
      dropdownId: {
        description: 'Explicit id for trigger/menu relation. Auto-generated when omitted.',
        type: 'string',
        control: 'text',
      },
    },
    events: {
      valueChange: {
        description: 'Emits selected option value after change.',
        type: 'string',
      },
    },
  },
  footer: {
    name: 'FooterComponent',
    selector: 'dsb-footer',
    description: 'Site footer with brand section, navigation columns and legal links.',
    stability: 'stable',
    since: '1.0.0',
    props: {
      brandName: {
        description: 'Brand label displayed near the logo.',
        type: 'string',
        defaultValue: "'Design System'",
        control: 'text',
      },
      logoSrc: {
        description: 'Optional logo image URL.',
        type: 'string',
        defaultValue: "''",
        control: 'text',
      },
      logoHref: {
        description: 'Navigation target for logo/brand link.',
        type: 'string',
        defaultValue: "'/'",
        control: 'text',
      },
      tagline: {
        description: 'Optional short brand/supporting statement.',
        type: 'string',
        defaultValue: "''",
        control: 'text',
      },
      columns: {
        description: 'Footer navigation columns and links.',
        type: 'FooterColumn[]',
        defaultValue: '[]',
      },
      copyright: {
        description: 'Copyright text shown in the bottom row.',
        type: 'string',
        control: 'text',
      },
      legalLinks: {
        description: 'Bottom legal links rendered inline.',
        type: 'FooterLink[]',
        defaultValue: '[]',
      },
    },
  },
  header: {
    name: 'HeaderComponent',
    selector: 'dsb-header',
    description: 'Top navigation header with brand, nav links and optional CTA.',
    stability: 'stable',
    since: '1.0.0',
    props: {
      brandName: {
        description: 'Brand text rendered in the left section.',
        type: 'string',
        defaultValue: "'Design System'",
        control: 'text',
      },
      logoSrc: {
        description: 'Optional logo image URL.',
        type: 'string',
        defaultValue: "''",
        control: 'text',
      },
      logoAlt: {
        description: 'Alternative text for the logo image.',
        type: 'string',
        defaultValue: "'Logo'",
        control: 'text',
      },
      logoHref: {
        description: 'Navigation target for clicking the logo/brand area.',
        type: 'string',
        defaultValue: "'/'",
        control: 'text',
      },
      navItems: {
        description: 'Top-level navigation links.',
        type: 'NavItem[]',
        defaultValue: '[]',
      },
      ctaLabel: {
        description: 'Optional label for right-side call-to-action link.',
        type: 'string',
        defaultValue: "''",
        control: 'text',
      },
      ctaHref: {
        description: 'Href for call-to-action link.',
        type: 'string',
        defaultValue: "'#'",
        control: 'text',
      },
    },
  },
  input: {
    name: 'InputComponent',
    selector: 'dsb-input',
    description: 'Text input control with CVA support, hints and error state.',
    stability: 'stable',
    since: '1.0.0',
    props: {
      label: {
        description: 'Visible label above the input.',
        type: 'string',
        defaultValue: "''",
        control: 'text',
      },
      type: {
        description: 'Native input type.',
        type: "'text' | 'email' | 'password' | 'number' | 'search' | 'tel' | 'url'",
        defaultValue: "'text'",
        control: 'select',
        options: ['text', 'email', 'password', 'number', 'search', 'tel', 'url'],
      },
      placeholder: {
        description: 'Placeholder value shown when the input is empty.',
        type: 'string',
        defaultValue: "''",
        control: 'text',
      },
      size: {
        description: 'Visual size variant.',
        type: "'sm' | 'md' | 'lg'",
        defaultValue: "'md'",
        control: 'select',
        options: ['sm', 'md', 'lg'],
      },
      hasError: {
        description: 'Enables error visual state and message rendering.',
        type: 'boolean',
        defaultValue: 'false',
        control: 'boolean',
      },
      errorMessage: {
        description: 'Error text displayed when hasError is true.',
        type: 'string',
        defaultValue: "''",
        control: 'text',
      },
      hint: {
        description: 'Supporting text rendered when no error is active.',
        type: 'string',
        defaultValue: "''",
        control: 'text',
      },
      disabled: {
        description: 'Disables the native input and interactions.',
        type: 'boolean',
        defaultValue: 'false',
        control: 'boolean',
      },
      inputId: {
        description: 'Explicit input id for label association. Auto-generated by default.',
        type: 'string',
        control: 'text',
      },
    },
    events: {
      valueChange: {
        description: 'Emits current text value on user input.',
        type: 'string',
      },
    },
  },
  list: {
    name: 'ListComponent',
    selector: 'dsb-list',
    description: 'Container for list items with optional separators and compact mode.',
    stability: 'stable',
    since: '1.0.0',
    props: {
      divided: {
        description: 'When true, separates neighboring items with dividers.',
        type: 'boolean',
        defaultValue: 'true',
        control: 'boolean',
      },
      bordered: {
        description: 'Adds outer border and rounded corners around the list.',
        type: 'boolean',
        defaultValue: 'false',
        control: 'boolean',
      },
      compact: {
        description: 'Reduces vertical spacing for dense data display.',
        type: 'boolean',
        defaultValue: 'false',
        control: 'boolean',
      },
    },
  },
  listItem: {
    name: 'ListItemComponent',
    selector: 'dsb-list-item',
    description: 'A single row inside dsb-list, with optional description, meta text and status indicator.',
    storybookTitle: 'Components/List',
    stability: 'stable',
    since: '1.0.0',
    props: {
      label: {
        description: 'Primary line text.',
        type: 'string',
        defaultValue: "''",
        control: 'text',
      },
      description: {
        description: 'Secondary descriptive text below the label.',
        type: 'string',
        defaultValue: "''",
        control: 'text',
      },
      meta: {
        description: 'Auxiliary right-aligned meta text.',
        type: 'string',
        defaultValue: "''",
        control: 'text',
      },
      variant: {
        description: 'Semantic visual variant for status contexts.',
        type: "'default' | 'info' | 'success' | 'warning' | 'error'",
        defaultValue: "'default'",
        control: 'select',
        options: ['default', 'info', 'success', 'warning', 'error'],
      },
      indicator: {
        description: 'Shows a compact leading indicator dot.',
        type: 'boolean',
        defaultValue: 'false',
        control: 'boolean',
      },
    },
  },
  modal: {
    name: 'ModalComponent',
    selector: 'dsb-modal',
    description: 'Dialog overlay for critical tasks and confirmations.',
    stability: 'stable',
    since: '1.0.0',
    props: {
      open: {
        description: 'Controls modal visibility state.',
        type: 'boolean',
        defaultValue: 'false',
        control: 'boolean',
      },
      title: {
        description: 'Dialog heading used as the accessible label when provided.',
        type: 'string',
        defaultValue: "''",
        control: 'text',
      },
      ariaLabel: {
        description: 'Accessible name fallback when title is omitted.',
        type: 'string',
        defaultValue: "''",
        control: 'text',
      },
      size: {
        description: 'Dialog max-width size variant.',
        type: "'sm' | 'md' | 'lg' | 'xl'",
        defaultValue: "'md'",
        control: 'select',
        options: ['sm', 'md', 'lg', 'xl'],
      },
      closeOnBackdrop: {
        description: 'Allows closing the modal by clicking the backdrop.',
        type: 'boolean',
        defaultValue: 'true',
        control: 'boolean',
      },
    },
    events: {
      openChange: {
        description: 'Two-way binding companion event emitted on close.',
        type: 'boolean',
      },
      closed: {
        description: 'Emitted whenever the modal transitions to closed state.',
        type: 'void',
      },
    },
  },
  radioGroup: {
    name: 'RadioGroupComponent',
    selector: 'dsb-radio-group',
    description: 'Single-choice selection group with optional hints and validation state.',
    stability: 'stable',
    since: '1.0.0',
    props: {
      options: {
        description: 'Available radio options.',
        type: 'RadioOption[]',
        defaultValue: '[]',
      },
      legend: {
        description: 'Fieldset legend describing the decision.',
        type: 'string',
        defaultValue: "''",
        control: 'text',
      },
      disabled: {
        description: 'Disables the entire group interaction.',
        type: 'boolean',
        defaultValue: 'false',
        control: 'boolean',
      },
      hasError: {
        description: 'Toggles error style and message display.',
        type: 'boolean',
        defaultValue: 'false',
        control: 'boolean',
      },
      errorMessage: {
        description: 'Error text displayed when hasError is true.',
        type: 'string',
        defaultValue: "''",
        control: 'text',
      },
      inline: {
        description: 'Displays options in a horizontal row.',
        type: 'boolean',
        defaultValue: 'false',
        control: 'boolean',
      },
      groupName: {
        description: 'Native name attribute for radio grouping. Auto-generated by default.',
        type: 'string',
        control: 'text',
      },
    },
    events: {
      valueChange: {
        description: 'Emits selected option value.',
        type: 'string',
      },
    },
  },
  table: {
    name: 'TableComponent',
    selector: 'dsb-table',
    description: 'Data table supporting custom header and cell templates per column.',
    stability: 'beta',
    since: '1.0.0',
    props: {
      rows: {
        description: 'Row dataset to render. Keys are consumed by dsb-column key bindings.',
        type: 'Record<string, unknown>[]',
        defaultValue: '[]',
      },
      striped: {
        description: 'Applies zebra striping to data rows.',
        type: 'boolean',
        defaultValue: 'false',
        control: 'boolean',
      },
      hoverable: {
        description: 'Highlights rows on hover.',
        type: 'boolean',
        defaultValue: 'true',
        control: 'boolean',
      },
      loading: {
        description: 'Shows loading state while data is being fetched.',
        type: 'boolean',
        defaultValue: 'false',
        control: 'boolean',
      },
      rowClickable: {
        description: 'Enables row click interactions and pointer affordance.',
        type: 'boolean',
        defaultValue: 'false',
        control: 'boolean',
      },
      emptyMessage: {
        description: 'Message rendered when rows array is empty.',
        type: 'string',
        defaultValue: "'No data to display.'",
        control: 'text',
      },
    },
    events: {
      rowClick: {
        description: 'Emits full row object when a row is clicked.',
        type: 'Record<string, unknown>',
      },
    },
  },
  tag: {
    name: 'TagComponent',
    selector: 'dsb-tag',
    description: 'Compact status label used for categorization and emphasis.',
    stability: 'stable',
    since: '1.0.0',
    props: {
      variant: {
        description: 'Visual status variant.',
        type: "'default' | 'primary' | 'success' | 'warning' | 'danger' | 'info'",
        defaultValue: "'default'",
        control: 'select',
        options: ['default', 'primary', 'success', 'warning', 'danger', 'info'],
      },
      size: {
        description: 'Tag size variant.',
        type: "'sm' | 'md'",
        defaultValue: "'md'",
        control: 'select',
        options: ['sm', 'md'],
      },
    },
  },
};

export function getMcpContract(key: ComponentContractKey): ComponentContract {
  return contracts[key];
}

export function getArgTypes(key: ComponentContractKey): Record<string, unknown> {
  const contract = contracts[key];
  const argTypes: Record<string, unknown> = {};

  for (const [prop, meta] of Object.entries(contract.props)) {
    argTypes[prop] = {
      description: meta.description,
      control: meta.control ?? false,
      options: meta.options,
      table: {
        category: 'inputs',
        type: { summary: meta.type },
        defaultValue: meta.defaultValue ? { summary: meta.defaultValue } : undefined,
      },
      ...(meta.deprecated ? { deprecationReason: meta.deprecated } : {}),
    };
  }

  for (const [eventName, meta] of Object.entries(contract.events ?? {})) {
    argTypes[eventName] = {
      description: meta.description,
      action: eventName,
      table: {
        category: 'outputs',
        type: { summary: meta.type },
      },
      ...(meta.deprecated ? { deprecationReason: meta.deprecated } : {}),
    };
  }

  return argTypes;
}
