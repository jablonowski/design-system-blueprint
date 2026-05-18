import { Component, Input, Output, EventEmitter, forwardRef } from '@angular/core';
import { NgClass, NgIf } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

export type InputSize = 'sm' | 'md' | 'lg';
export type InputType = 'text' | 'email' | 'password' | 'number' | 'search' | 'tel' | 'url';

@Component({
  selector: 'dsb-input',
  standalone: true,
  imports: [NgClass, NgIf],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputComponent),
      multi: true,
    },
  ],
  template: `
    <div class="field" [ngClass]="{ 'field-error': hasError, 'field-disabled': disabled }">
      <label *ngIf="label" [attr.for]="inputId" class="label">{{ label }}</label>
      <div class="input-wrap">
        <input
          [id]="inputId"
          [type]="type"
          [placeholder]="placeholder"
          [disabled]="disabled"
          [attr.aria-describedby]="hasError && errorMessage ? inputId + '-error' : null"
          [attr.aria-invalid]="hasError || null"
          class="input"
          [ngClass]="['input-' + size]"
          [value]="value"
          (input)="onInput($event)"
          (blur)="onTouched()"
        />
      </div>
      <p *ngIf="hasError && errorMessage" [id]="inputId + '-error'" class="error-msg">
        {{ errorMessage }}
      </p>
      <p *ngIf="hint && !hasError" class="hint">{{ hint }}</p>
    </div>
  `,
  styleUrls: ['./input.component.css'],
})
export class InputComponent implements ControlValueAccessor {
  private static idCounter = 0;

  @Input() label = '';
  @Input() type: InputType = 'text';
  @Input() placeholder = '';
  @Input() size: InputSize = 'md';
  @Input() hasError = false;
  @Input() errorMessage = '';
  @Input() hint = '';
  @Input() disabled = false;
  @Input() inputId = `dsb-input-${++InputComponent.idCounter}`;

  @Output() valueChange = new EventEmitter<string>();

  value = '';
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  onTouched: () => void = () => {};
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private onChange: (v: string) => void = () => {};

  onInput(event: Event): void {
    const val = (event.target as HTMLInputElement).value;
    this.value = val;
    this.onChange(val);
    this.valueChange.emit(val);
  }

  writeValue(val: string): void { this.value = val ?? ''; }
  registerOnChange(fn: (v: string) => void): void { this.onChange = fn; }
  registerOnTouched(fn: () => void): void { this.onTouched = fn; }
  setDisabledState(disabled: boolean): void { this.disabled = disabled; }
}
