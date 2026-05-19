import { Component, Input } from '@angular/core';
import { NgFor, NgIf } from '@angular/common';

export interface NavItem {
  label: string;
  href: string;
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
  @Input() brandName = 'Design System';
  @Input() logoSrc = '';
  @Input() logoAlt = 'Logo';
  @Input() logoHref = '/';
  @Input() navItems: NavItem[] = [];
  @Input() ctaLabel = '';
  @Input() ctaHref = '#';
}
