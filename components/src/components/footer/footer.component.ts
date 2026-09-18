import { Component, Input } from '@angular/core';
import { NgFor, NgIf } from '@angular/common';

export interface FooterLink {
  /** Visible link text. */
  label: string;
  /** Navigation target for the link. */
  href: string;
}

export interface FooterColumn {
  /** Column title. */
  heading: string;
  /** Column links. */
  links: FooterLink[];
}

@Component({
  selector: 'dsb-footer',
  standalone: true,
  imports: [NgFor, NgIf],
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css'],
})
export class FooterComponent {
  /** Brand label displayed in the top row. */
  @Input() brandName = 'Design System';
  /** Optional brand logo URL. */
  @Input() logoSrc = '';
  /** Target href for brand/logo link. */
  @Input() logoHref = '/';
  /** Optional short text under brand. */
  @Input() tagline = '';
  /** Footer navigation columns. */
  @Input() columns: FooterColumn[] = [];
  /** Copyright line in the bottom row. */
  @Input() copyright = `© ${new Date().getFullYear()} Blueprint. All rights reserved.`;
  /** Legal links rendered in the bottom row. */
  @Input() legalLinks: FooterLink[] = [];
}
