import { Component, Input } from '@angular/core';
import { NgClass } from '@angular/common';

@Component({
  selector: 'dsb-list',
  standalone: true,
  imports: [NgClass],
  template: `
    <ul
      class="list"
      [ngClass]="{
        'list-divided': divided,
        'list-bordered': bordered,
        'list-compact': compact
      }"
    >
      <ng-content></ng-content>
    </ul>
  `,
  styleUrls: ['./list.component.css'],
})
export class ListComponent {
  @Input() divided = true;
  @Input() bordered = false;
  @Input() compact = false;
}
