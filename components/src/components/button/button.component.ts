import { Component, Input, Output, EventEmitter } from '@angular/core';
import { NgClass, NgIf } from '@angular/common';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg';

@Component({
  selector: 'dsb-button',
  standalone: true,
  imports: [NgClass, NgIf],
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.css'],
})
export class ButtonComponent {
  /** Visual style variant. */
  @Input() variant: ButtonVariant = 'primary';
  /** Visual size variant. */
  @Input() size: ButtonSize = 'md';
  /** Disables interactions and applies disabled styles. */
  @Input() disabled = false;
  /** Shows a spinner and blocks interaction. */
  @Input() loading = false;
  /** Expands button width to fill parent container. */
  @Input() fullWidth = false;
  /** Native HTML button type attribute. */
  @Input() type: 'button' | 'submit' | 'reset' = 'button';
  /**
   * Emits the native click event.
   * @deprecated Use native (click) binding on the host element.
   */
  @Output() onClick = new EventEmitter<MouseEvent>();

  get classes(): Record<string, boolean> {
    return {
      btn: true,
      [`btn-${this.variant}`]: true,
      [`btn-${this.size}`]: true,
      'btn-full': this.fullWidth,
      'btn-loading': this.loading,
    };
  }
}
