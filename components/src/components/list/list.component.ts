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
  @Input() divided = true;
  @Input() bordered = false;
  @Input() compact = false;
}
