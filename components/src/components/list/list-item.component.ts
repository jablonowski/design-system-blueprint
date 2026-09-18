import { Component, Input } from '@angular/core';
import { NgClass, NgIf } from '@angular/common';

export type ListItemVariant = 'default' | 'info' | 'success' | 'warning' | 'error';

@Component({
  selector: 'dsb-list-item',
  standalone: true,
  imports: [NgClass, NgIf],
  templateUrl: './list-item.component.html',
  styleUrls: ['./list-item.component.css'],
})
export class ListItemComponent {
  /** Primary line text. */
  @Input() label = '';
  /** Secondary descriptive text. */
  @Input() description = '';
  /** Auxiliary right-aligned meta text. */
  @Input() meta = '';
  /** Semantic visual variant for status contexts. */
  @Input() variant: ListItemVariant = 'default';
  /** Shows a compact leading indicator dot. */
  @Input() indicator = false;
}
