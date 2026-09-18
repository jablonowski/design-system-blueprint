import { Component, Input } from '@angular/core';
import { NgClass } from '@angular/common';

@Component({
  selector: 'dsb-list',
  standalone: true,
  imports: [NgClass],
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css'],
})
export class ListComponent {
  /** Shows divider lines between list items. */
  @Input() divided = true;
  /** Adds outer border and rounded container. */
  @Input() bordered = false;
  /** Reduces spacing for dense list layouts. */
  @Input() compact = false;
}
