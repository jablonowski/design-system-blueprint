import { Component, Input } from '@angular/core';
import { NgFor, NgIf } from '@angular/common';

export interface FooterLink {
  label: string;
  href: string;
}

export interface FooterColumn {
  heading: string;
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
  @Input() brandName = 'Design System';
  @Input() logoSrc = '';
  @Input() logoHref = '/';
  @Input() tagline = '';
  @Input() columns: FooterColumn[] = [];
  @Input() copyright = `© ${new Date().getFullYear()} Blueprint. All rights reserved.`;
  @Input() legalLinks: FooterLink[] = [];
}
