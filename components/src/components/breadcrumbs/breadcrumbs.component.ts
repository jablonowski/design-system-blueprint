import { Component, Input } from '@angular/core';
import { NgFor, NgIf } from '@angular/common';

export interface BreadcrumbItem {
  /** Visible breadcrumb label. */
  label: string;
  /** Optional target URL. Omit for the current page item. */
  href?: string;
}

@Component({
  selector: 'dsb-breadcrumbs',
  standalone: true,
  imports: [NgFor, NgIf],
  templateUrl: './breadcrumbs.component.html',
  styleUrls: ['./breadcrumbs.component.css'],
})
export class BreadcrumbsComponent {
  /** Ordered breadcrumb trail. Last item is treated as current page. */
  @Input() items: BreadcrumbItem[] = [];
}
