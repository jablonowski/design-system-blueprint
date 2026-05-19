import { Component, Input } from '@angular/core';
import { NgFor, NgIf } from '@angular/common';

export interface BreadcrumbItem {
  label: string;
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
  @Input() items: BreadcrumbItem[] = [];
}
