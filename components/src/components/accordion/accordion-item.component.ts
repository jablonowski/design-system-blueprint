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
  /** Header text displayed in toggle button. */
  @Input() title = '';
  /** Initial/controlled open state. */
  @Input() open = false;
  /** Prevents toggling when true. */
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
