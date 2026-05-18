import { Component, Input, Output, EventEmitter } from '@angular/core';
import { NgClass, NgIf } from '@angular/common';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg';

@Component({
  selector: 'dsb-button',
  standalone: true,
  imports: [NgClass, NgIf],
  template: `
    <button
      [type]="type"
      [disabled]="disabled || loading"
      [ngClass]="classes"
      (click)="onClick.emit($event)"
    >
      <span *ngIf="loading" class="spinner" aria-hidden="true"></span>
      <ng-content></ng-content>
    </button>
  `,
  styleUrls: ['./button.component.css'],
})
export class ButtonComponent {
  @Input() variant: ButtonVariant = 'primary';
  @Input() size: ButtonSize = 'md';
  @Input() disabled = false;
  @Input() loading = false;
  @Input() fullWidth = false;
  @Input() type: 'button' | 'submit' | 'reset' = 'button';
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
