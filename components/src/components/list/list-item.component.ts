import { Component, Input } from '@angular/core';
import { NgClass, NgIf } from '@angular/common';

export type ListItemVariant = 'default' | 'info' | 'success' | 'warning' | 'error';

@Component({
  selector: 'dsb-list-item',
  standalone: true,
  imports: [NgClass, NgIf],
  template: `
    <li
      class="list-item"
      [ngClass]="['list-item--' + variant, indicator ? 'list-item--indicator' : '']"
    >
      <span *ngIf="indicator" class="list-item-dot" [ngClass]="'dot--' + variant"></span>

      <div class="list-item-leading">
        <ng-content select="[list-leading]"></ng-content>
      </div>

      <div class="list-item-body">
        <div *ngIf="label || meta" class="list-item-top">
          <span *ngIf="label" class="list-item-label">{{ label }}</span>
          <span *ngIf="meta" class="list-item-meta">{{ meta }}</span>
        </div>
        <p *ngIf="description" class="list-item-description">{{ description }}</p>
        <ng-content></ng-content>
      </div>

      <div class="list-item-trailing">
        <ng-content select="[list-trailing]"></ng-content>
      </div>
    </li>
  `,
  styleUrls: ['./list-item.component.css'],
})
export class ListItemComponent {
  @Input() label = '';
  @Input() description = '';
  @Input() meta = '';
  @Input() variant: ListItemVariant = 'default';
  @Input() indicator = false;
}
