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
  @Input() label = '';
  @Input() description = '';
  @Input() meta = '';
  @Input() variant: ListItemVariant = 'default';
  @Input() indicator = false;
}
