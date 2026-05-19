import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgClass, NgIf } from '@angular/common';

@Component({
  selector: 'dsb-accordion-item',
  standalone: true,
  imports: [NgClass, NgIf],
  templateUrl: './accordion-item.component.html',
  styleUrls: ['./accordion-item.component.css'],
})
export class AccordionItemComponent {
  @Input() title = '';
  @Input() open = false;
  @Input() disabled = false;

  /** Internal event used by AccordionComponent to coordinate exclusive mode */
  readonly toggled = new EventEmitter<void>();

  toggle(): void {
    this.open = !this.open;
    this.toggled.emit();
  }

  close(): void {
    this.open = false;
  }
}
