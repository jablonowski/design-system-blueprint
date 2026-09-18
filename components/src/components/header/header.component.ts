import { Component, Input } from '@angular/core';
import { NgFor, NgIf } from '@angular/common';

export interface NavItem {
  /** Visible navigation label. */
  label: string;
  /** Navigation target. */
  href: string;
  /** Marks item as active/current section. */
  active?: boolean;
}

@Component({
  selector: 'dsb-header',
  standalone: true,
  imports: [NgFor, NgIf],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent {
  /** Brand text shown in the left area. */
  @Input() brandName = 'Design System';
  /** Optional logo image URL. */
  @Input() logoSrc = '';
  /** Alternative text for logo image. */
  @Input() logoAlt = 'Logo';
  /** Target href for brand/logo link. */
  @Input() logoHref = '/';
  /** Navigation entries shown in the center area. */
  @Input() navItems: NavItem[] = [];
  /** Optional call-to-action label on the right side. */
  @Input() ctaLabel = '';
  /** Target href for call-to-action link. */
  @Input() ctaHref = '#';
}
